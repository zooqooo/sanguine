import DataManager from "../DataManager"
import { statBonus, DamageBaseTypeEnum, DamageSuperTypeEnum, damageType, QuantTypeEnum, statInfo, StatStackingTypeEnum, StatTypeEnum } from "../_types/StatTypes"

export default class ActorStat {
    private statQuantity: number //only used for static stats
    private otherStats: Map<StatTypeEnum, ActorStat>
    private name: StatTypeEnum
    private statInfo: statInfo

    constructor(name: StatTypeEnum) {
        this.otherStats = new Map<StatTypeEnum, ActorStat>()
        this.name = name
        this.statQuantity = 0
        this.statInfo = this.getStatInfo()
    }

    provideOtherStats(stats: Map<StatTypeEnum, ActorStat>) {
        this.otherStats = stats
    }
    
    private getStatInfo() : statInfo {
        let statInfo = DataManager.getInstance().getStatTypeData(this.name)
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

    get(bonuses: statBonus[], damageTypeContext? : damageType) : number {
        if ( this.isStatic() ) return this.statQuantity
        if ( this.isDamageTyped() && typeof damageTypeContext == 'undefined' ) {
            throw new Error(`Stat ${this.getName()} is damage typed, it's value cannot be determined without a damage type context`)
        }

        let filteredBonuses = new Array<statBonus>()
        for ( const bonus of bonuses ) {
            if ( bonus.stat == this.name ) {
                this.checkBonusLegality(bonus)
                filteredBonuses.push(bonus)
            }
        }

        if ( this.statInfo.damageTyped ) {
            filteredBonuses = ActorStat.filterByDamageType(filteredBonuses, damageTypeContext!)
        }

        return this.determine(filteredBonuses, damageTypeContext)
    }

    getStaticQuant() : number {
        if ( this.statInfo.damageTyped ) throw new Error(`Stat ${this.getName()} is damage typed, it's value cannot be determined without a damage type context`)
        return this.statQuantity
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
          STAT BONUS LEGALITY
    ----------------------------- */

    private checkBonusLegality(b: statBonus): void {
        if ( this.isStatic() ) throw new Error(`Stat ${this.getName()} does not allow any modification.`)
        if ( this.isArithmetic() && !ActorStat.isArithmetic(b) ) throw new Error(`Stat ${this.getName()} is typed arithmetic.`)
        if ( this.isFurther() && !ActorStat.isFurther(b) ) throw new Error(`Stat ${this.getName()} is typed further.`)
        if ( this.statInfo.linearOnly && ActorStat.isGeometric(b) ) throw new Error(`Stat ${this.getName()} is linear only.`)
        if ( this.statInfo.noPenalty && b.quantity < 0 ) throw new Error(`Stat ${this.getName()} does not allow penalties.`)
        if ( this.isFurther() && ( b.quantity < 0 || 1 < b.quantity ) ) throw new Error(`Further Bonus Error. Bonus values for Stat ${this.getName()} must be between 0 and 1.}`)
        if ( this.statInfo.damageTyped && !ActorStat.hasDamageType(b) ) throw new Error(`Stat ${this.getName()} is damage typed.`)
    }

    private static isArithmetic(bonus: statBonus): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Add, QuantTypeEnum.Increase, QuantTypeEnum.More]
        return allowedTypes.includes(bonus.quantType)
    }

    private static isGeometric(bonus: statBonus): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Increase, QuantTypeEnum.More]
        return allowedTypes.includes(bonus.quantType)
    }

    private static isFurther(bonus: statBonus): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Further]
        return allowedTypes.includes(bonus.quantType)
    }

    private static hasDamageType(bonus: statBonus): boolean {
        return typeof bonus.damageType !== 'undefined'
    }

    /* -----------------------------
             DAMAGE TYPE
    ----------------------------- */
    
    private static isPhysical(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Physical, DamageBaseTypeEnum.Slash, DamageBaseTypeEnum.Pierce, DamageBaseTypeEnum.Smash]
        return allowedTypes.includes(type)
    }

    private static isSpecial(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Special, DamageBaseTypeEnum.Crit, DamageBaseTypeEnum.Blast, DamageBaseTypeEnum.Psychic, DamageBaseTypeEnum.Precision]
        return allowedTypes.includes(type)
    }

    private static isElemental(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Elemental, DamageBaseTypeEnum.Fire, DamageBaseTypeEnum.Water, DamageBaseTypeEnum.Air, DamageBaseTypeEnum.Earth, DamageBaseTypeEnum.Arcane, DamageBaseTypeEnum.Null]
        return allowedTypes.includes(type)
    }
    
    private static compareDamageSuperTypeContext(type : DamageSuperTypeEnum, context: DamageSuperTypeEnum ): boolean {
        if ( context == DamageSuperTypeEnum.All ) return true
        
        if ( type == DamageSuperTypeEnum.All ) return true
        if ( context == type ) return true

        return false        
    }

    private static compareDamageBaseTypeContext(type : DamageBaseTypeEnum, context: DamageBaseTypeEnum ): boolean {
        if ( context == DamageBaseTypeEnum.All ) return true

        if ( type == DamageBaseTypeEnum.All ) return true
        if ( context == type ) return true

        if ( context == DamageBaseTypeEnum.Physical && ActorStat.isPhysical(type) ) return true
        if ( context == DamageBaseTypeEnum.Elemental && ActorStat.isElemental(type) ) return true
        if ( context == DamageBaseTypeEnum.Special && ActorStat.isSpecial(type) ) return true

        if ( type == DamageBaseTypeEnum.Physical && ActorStat.isPhysical(context) ) return true
        if ( type == DamageBaseTypeEnum.Elemental && ActorStat.isElemental(context) ) return true
        if ( type == DamageBaseTypeEnum.Special && ActorStat.isSpecial(context) ) return true
        
        return false        
    }

    static compareDamageContext(damageType : damageType, context: damageType | undefined ): boolean {
        if ( typeof context == 'undefined' ) return true
        if ( !this.compareDamageSuperTypeContext(damageType.superType, context.superType) ) return false
        if ( !this.compareDamageBaseTypeContext(damageType.baseType, context.baseType) ) return false
        return true
    }

    static filterByDamageType(bonuses: statBonus[], damageTypeContext: damageType): statBonus[] {
        let statBonuses: statBonus[] = []
        for ( const bonus of bonuses ) {
            if ( ActorStat.compareDamageContext(bonus.damageType!, damageTypeContext) ) {
                statBonuses.push(bonus)
            }
        }
        return statBonuses
    }

    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    private determine(bonuses: statBonus[], damageTypeContext? : damageType): number {
        if ( this.statInfo.stacking == StatStackingTypeEnum.Arithmetic ) {
            this.statQuantity = this.applyArithmeticBonuses(bonuses, damageTypeContext)        
        } else if ( this.statInfo.stacking == StatStackingTypeEnum.Further ) {
            this.statQuantity = this.applyFurtherBonuses(bonuses, damageTypeContext)        
        }
        return this.statQuantity
    }

    private determineBonus(b: statBonus): number {
        let mult = 1
        if ( typeof b.quantMult !== 'undefined' && b.quantMult !== StatTypeEnum.None ) {
            mult = this.otherStats.has(b.quantMult!) ? this.otherStats.get(b.quantMult!)!.getStaticQuant() : 1
        }
        let quant = b.quantity * mult
        
        return quant
    }

    private applyArithmeticBonuses(bonuses: statBonus[], damageType? : damageType): number {
        let addModifiers = 0
        let totalIncrease = 1
        let totalMore = 1

        for ( const bonus of bonuses ) {
            if ( bonus.quantType == QuantTypeEnum.Add ) {
                addModifiers = addModifiers + this.determineBonus(bonus)
            } else if ( bonus.quantType == QuantTypeEnum.Increase ) {
                totalIncrease = totalIncrease + this.determineBonus(bonus)
            } else if ( bonus.quantType == QuantTypeEnum.More ) {
                totalMore = totalMore * ( 1 + this.determineBonus(bonus) )
            }
        }
        
        let tempQuant = addModifiers
        tempQuant = tempQuant * totalIncrease
        tempQuant = tempQuant * totalMore

        if ( this.statInfo.hasMax && tempQuant > this.statInfo.max! ) tempQuant = this.statInfo.max!
        if ( this.statInfo.hasMin && tempQuant < this.statInfo.min! ) tempQuant = this.statInfo.min!

        return tempQuant
    }

	private applyFurtherBonuses(bonuses: statBonus[], damageType? : damageType): number {
        let quant = 1
        for ( const bonus of bonuses ) {
            let inverse = 1 - this.determineBonus(bonus)
            quant = quant * inverse
        }
        return 1 - quant
	}
}