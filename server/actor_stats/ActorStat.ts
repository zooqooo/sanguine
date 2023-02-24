import SanguineGameMediator from "../GameMediator"
import { damageType, QuantTypeEnum, statInfo, StatStackingTypeEnum, StatTypeEnum } from "../_types/StatTypes"
import ActorStats from "./ActorStats"
import StatBonus from "./StatBonus"

export default class ActorStat {
    private statQuantity: number //only used for static stats
    private name: StatTypeEnum
    private actor: ActorStats
    private statInfo: statInfo
    private bonuses: StatBonus[]

    constructor(actor: ActorStats, name: StatTypeEnum) {
        this.actor = actor
        this.name = name
        this.statQuantity = 0
        this.statInfo = this.getStatInfo()
        this.bonuses = new Array<StatBonus>()
    }
    
    private getStatInfo() : statInfo {
        let mediator = SanguineGameMediator.getInstance()
        let statInfo = mediator.getStatTypeData(this.name)
        if ( typeof statInfo == 'undefined') throw new Error(`Stat info not found for ${StatTypeEnum[this.name]}`)
        
        statInfo.linearOnly = statInfo.linearOnly ? true : false
        statInfo.noPenalty = statInfo.noPenalty ? true : false
        statInfo.damageTyped = statInfo.damageTyped ? true : false
        statInfo.hasMax = statInfo.hasMax ? true : false
        statInfo.hasMin = statInfo.hasMin ? true : false

        this.checkInfoLegality(statInfo)
        return statInfo
    }
    
    private checkInfoLegality(statInfo: statInfo): void {
        if ( statInfo.hasMax && typeof statInfo.max == 'undefined' ) throw new Error(`Stat ${this.getName()} has hasMax equal to ${statInfo.hasMax} but the max value is undefined`)
        if ( statInfo.hasMin && typeof statInfo.min == 'undefined' ) throw new Error(`Stat ${this.getName()} has hasMin equal to ${statInfo.hasMin} but the min value is undefined`)
        if ( statInfo.hasMax && statInfo.hasMin && statInfo.max! < statInfo.min!) throw new Error(`Stat ${this.getName()} has max value ${statInfo.max!}, less than min value ${statInfo.min!}`)
        if ( statInfo.stacking == StatStackingTypeEnum.Further &&  statInfo.linearOnly ) throw new Error(`Stat ${this.getName()} is of stacking type further. It must not be marked linearOnly.`)
        if ( statInfo.stacking == StatStackingTypeEnum.Further &&  ( statInfo.hasMin || statInfo.hasMax ) ) throw new Error(`Stat ${this.getName()} is of stacking type further. It must not be marked with a minimum or maximum value.`)
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    getStatType() : StatTypeEnum {
        return this.name
    }

    getName() : string {
        return StatTypeEnum[this.name]
    }

    get(damageType? : damageType) : number {
        if ( this.isStatic() ) return this.statQuantity
        if ( this.statInfo.damageTyped && typeof damageType == 'undefined' ) throw new Error(`Stat ${this.getName()} is damage typed, it's value cannot be determined without a damage type context`)

        return this.determine(this.bonuses, damageType)
    }

    getInstant(extraBonuses: StatBonus[], damageType?: damageType) {
        if ( this.isStatic() ) return this.statQuantity
        if ( this.statInfo.damageTyped && typeof damageType == 'undefined' ) throw new Error(`Stat ${this.getName()} is damage typed, it's value cannot be determined without a damage type context`)

        let filteredBonuses = new Array<StatBonus>()
        for ( const bonus of extraBonuses ) {
            if ( bonus.getStat() == this.name ) {
                this.checkBonusLegality(bonus)
                filteredBonuses.push(bonus)
            }
        }
        const combinedBonuses = filteredBonuses.concat(this.bonuses)

        return this.determine(combinedBonuses, damageType)
    }

    isStatic() : boolean {
        return this.statInfo.stacking == StatStackingTypeEnum.None
    }

    isArithmetic() : boolean {
        return this.statInfo.stacking == StatStackingTypeEnum.Arithmetic
    }

    isFurther() : boolean {
        return this.statInfo.stacking == StatStackingTypeEnum.Further
    }

    isDamageTyped(): boolean {
        return this.statInfo.damageTyped!
    }

    set(quant: number): void {
        if ( !this.isStatic() ) throw new Error(`Stat ${this.getName()} with stacking type ${StatStackingTypeEnum[this.statInfo.stacking]} may not be set explicitly`)
        this.statQuantity = quant
    }


    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    update(): StatBonus[] {
        this.bonuses = new Array<StatBonus>()
        this.actor.getSources().forEach( (e) => {
            e.getBonuses().forEach( (b) => {
                if ( b.getStat() == this.name ) {
                    this.checkBonusLegality(b)
                    this.bonuses!.push(b)
                }
            })
        })
        return this.bonuses
    }

    private checkBonusLegality(b: StatBonus): void {
        if ( this.isStatic() ) throw new Error(`Stat ${this.getName()} does not allow modification. But bonus ${b.getSourceName()} was applied.`)
        if ( this.isArithmetic() && !b.isArithmetic() ) throw new Error(`Stat ${this.getName()} is typed arithmetic. But bonus ${b.getSourceName()} applies a non-arithmetic bonus`)
        if ( this.isFurther() && !b.isFurther() ) throw new Error(`Stat ${this.getName()} is typed further. But bonus ${b.getSourceName()} applies a non-further bonus`)
        if ( this.statInfo.linearOnly && b.isGeometric() ) throw new Error(`Stat ${this.getName()} is linear only. But bonus ${b.getSourceName()} applies a geometric bonus`)
        if ( this.statInfo.noPenalty && b.getQuantity() < 0 ) throw new Error(`Stat ${this.getName()} does not allow penalties. But bonus ${b.getSourceName()} applies a penalty`)
        if ( this.isFurther() && ( b.getQuantity() < 0 || 1 < b.getQuantity() ) ) throw new Error(`Further Bonus Error. Bonus values for Stat ${this.getName()} must be between 0 and 1, got ${b.getQuantity()} from ${b.getSourceName()}`)
        if ( this.statInfo.damageTyped && !b.hasDamageType() ) throw new Error(`Stat ${this.getName()} is damage typed. But bonus ${b.getSourceName()} has no damage type`)
    }
    
    private determine(bonuses: StatBonus[], damageType? : damageType): number {
        if ( this.statInfo.stacking == StatStackingTypeEnum.Arithmetic ) {
            return this.applyArithmeticBonuses(bonuses, damageType)        
        } else if ( this.statInfo.stacking == StatStackingTypeEnum.Further ) {
            return this.applyFurtherBonuses(bonuses, damageType)        
        } else {
            return this.statQuantity
        }
    }

    private determineBonus(b: StatBonus): number {
        let quant = 1
        if ( b.getQuantMult() !== StatTypeEnum.None ) {
            quant = b.getQuantity(this.actor.getStat(b.getQuantMult()).get())
        }
        quant = b.getQuantity(quant)
        
        return quant
    }

    private applyArithmeticBonuses(bonuses: StatBonus[], damageType? : damageType): number {
        let addModifiers = 0
        let totalIncrease = 1
        let totalMore = 1

        for ( const bonus of bonuses ) {
            if ( bonus.compareDamageContext(damageType) ) {
                if ( bonus.getQuantType() == QuantTypeEnum.Add ) {
                    addModifiers = addModifiers + this.determineBonus(bonus)
                } else if ( bonus.getQuantType() == QuantTypeEnum.Increase ) {
                    totalIncrease = totalIncrease + this.determineBonus(bonus)
                } else if ( bonus.getQuantType() == QuantTypeEnum.More ) {
                    totalMore = totalMore * ( 1 + this.determineBonus(bonus) )
                }
            }
        }
        
        let tempQuant = addModifiers
        tempQuant = tempQuant * totalIncrease
        tempQuant = tempQuant * totalMore

        if ( this.statInfo.hasMax && tempQuant > this.statInfo.max! ) tempQuant = this.statInfo.max!
        if ( this.statInfo.hasMin && tempQuant < this.statInfo.min! ) tempQuant = this.statInfo.min!

        return tempQuant
    }

	private applyFurtherBonuses(bonuses: StatBonus[], damageType? : damageType): number {
        let quant = 1
        for ( const bonus of bonuses ) {
            if ( bonus.compareDamageContext(damageType) ) {
                let inverse = 1 - this.determineBonus(bonus)
                quant = quant * inverse
            }
        }
        return 1 - quant
	}
}