import DataManager from "../DataManager"
import ActorStat from "./ActorStat"
import BonusSource from "./BonusSource"
import { statBonus, damageQuant, DamageSuperTypeEnum, damageType, ElementalTypeEnum, StatTypeEnum } from "../_types/StatTypes"

function sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z))
}

export default class ActorStats {
    private stats: Map<StatTypeEnum, ActorStat>
    private damageAccumulators: Map<DamageSuperTypeEnum, number> 
    private sources: Map<string, BonusSource>
    private context: boolean

    constructor(statTypes?: StatTypeEnum[]) {
        this.stats = new Map<StatTypeEnum, ActorStat>()
        this.damageAccumulators = new Map<DamageSuperTypeEnum, number>()
        this.sources = new Map<string, BonusSource>()
        this.context = true

        if (typeof statTypes == 'undefined') {
            statTypes = DataManager.getInstance().getAllStats()
        }

        for ( const statType of statTypes ) {
            let stat = new ActorStat(statType)
            this.stats.set(statType, stat)
        }

        for ( const [name, stat] of this.stats ) {
            stat.provideOtherStats(this.stats)
        }
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    getStat(name: StatTypeEnum): ActorStat {
        if ( !this.stats.has(name) ) throw new Error(`Attempted to fetch stat that isn't present ${StatTypeEnum[name]}`)
        return this.stats.get(name)!
    }

    getStatValue(name: StatTypeEnum, damageType?: damageType): number {
        const stat = this.getStat(name)
        return stat.determineValue(ActorStats.filterBonusSourcesByStat(this.getStatBonuses(this.context), stat), damageType)
    }

    getInstantStatValue(name: StatTypeEnum, bonuses: statBonus[], damageType?: damageType): number {
        return this.getStat(name).determineValue(bonuses, damageType)
    }
    
    getStatValues(): Map<string, number> {
        let values = new Map<string, number>()

        this.stats.forEach( (e, i) => {
            if (!e.isDamageTyped()) {
                //there's no mechanism to retrieve the generic value of damage typed stats at this point
                values.set(e.getName(), e.determineValue(ActorStats.filterBonusSourcesByStat(this.getStatBonuses(this.context), e)))
            }
        })
        return values
    }

    getStatNames(): string[] {
        let values = new Array<string>()
        this.stats.forEach( (e) => {
            values.push(e.getName())
        })
        return values
    }

    getSources(): Map<string, BonusSource> {
        return this.sources
    }

    getStatBonuses(context: boolean): statBonus[] {
        const bonusSources = Array.from(this.sources.values())
        return ActorStats.filterSourcesToStatBonusByContext(bonusSources, context)
    }

    setContext(context: boolean): ActorStats {
        this.context = context
        return this
    }

    /* -----------------------------
              SET SOURCES
    ----------------------------- */

    addSource(source: BonusSource): void {
        if ( this.sources.has(source.getID())) {
            throw new Error(`Attempted to add duplicate bonus source ${source.getID()}`)
        } else {
            this.sources.set(source.getID(), source)
            this.update()
        }
    }

    removeSource(source: BonusSource): void {
        if ( this.sources.has(source.getID())) {
            this.sources.delete(source.getID())
            this.update()
        } else {
            throw new Error(`Attempted to remove non-existant bonus source ${source.getID()}`)
        }
    }

    addMultipleSources(sources: BonusSource[]): void {
        sources.forEach( (source) => {
            this.addSource(source)
        })
    }

    addSourceByName(source: string): void {
        this.addSource(BonusSource.fromName(source))
    }

    addMultipleSourcesByName(sources: string[]): void {
        sources.forEach( (source) => {
            this.addSourceByName(source)
        })
    }

    removeMultipleSources(sources: BonusSource[]): void {
        sources.forEach( (source) => {
            this.removeSource(source)
        })
    }

    removeSourceByName(source: string): void {
        this.removeSource(BonusSource.fromName(source))
    }

    removeMultipleBonusSourcesByName(sources: string[]): void {
        sources.forEach( (source) => {
            this.removeSourceByName(source)
        })
    }

    /* ----   FILTER    ---- */
    
    static filterSourcesToStatBonusByContext(bonusSources: BonusSource[], context: boolean): statBonus[] {
        let statBonuses: statBonus[] = []
        for ( const source of bonusSources ) {
            for ( const bonus of source.getStatBonusesByContext(context)) {
                statBonuses.push(bonus)
            }
        }
        return statBonuses
    }

    static filterBonusSourcesByStat(bonuses: statBonus[], stat: ActorStat): statBonus[] {
        let statBonuses: statBonus[] = []
        for ( const bonus of bonuses ) {
            if ( bonus.stat == stat.getStatType() ) {
                if ( stat.isStatic() ) throw new Error(`Stat ${stat.getName()} does not allow modification.`)
                if ( stat.isDamageTyped() && typeof bonus.damageType == 'undefined' ) throw new Error(`Stat ${stat.getName()} is damage typed, it's value cannot be determined without a damage type context`)
                stat.checkBonusLegality(bonus)
                statBonuses.push(bonus)
            }
        }
        return statBonuses
    }
    
    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    /* ----   UPDATE    ---- */
    
    update(): void {
        for ( const [name, stat] of this.stats) {
            const bonusArray = ActorStats.filterBonusSourcesByStat(this.getStatBonuses(true), stat)
            if ( !stat.isDamageTyped() ) {
                stat.determineValue(bonusArray)
            }
        }
        this.setStaticStats()
    }

    setStaticStats(): void {
        if ( this.stats.has(StatTypeEnum.Speed)) {
            let value = Math.sqrt(this.getStatValue(StatTypeEnum.Agility)+this.getStatValue(StatTypeEnum.Alacrity)+1)-1
            this.getStat(StatTypeEnum.Speed).setStatic(value)
        }
    }

    /* ----   SOURCES    ---- */
    
    setBaseArmor(armor: { armorValue: number, infusions: { type: ElementalTypeEnum, level: number }[] }): void {
        const armorType = [ StatTypeEnum.Fire_Base_Armor, StatTypeEnum.Water_Base_Armor, StatTypeEnum.Air_Base_Armor, StatTypeEnum.Earth_Base_Armor, StatTypeEnum.Arcane_Base_Armor, StatTypeEnum.Null_Base_Armor ]
		this.getStat(StatTypeEnum.Physical_Base_Armor).setStatic(armor.armorValue)
		armor.infusions.forEach( (e) => {
			let elementArmorValue = armor.armorValue * (e.level/(1+e.level))
            this.getStat(armorType[e.type]).setStatic(elementArmorValue)
		})
	}

    /* ----   TRIALS    ---- */

    performTrial(statName: StatTypeEnum, difficulty: number ): boolean {
        const stat = this.getStatValue(statName)
        const delta = ( stat - difficulty ) / 10
        const prob = sigmoid(delta)
        const roll = Math.random()
        return prob > roll
    }

    /* ----   DAMAGE    ---- */

    applyDamage(damage: damageQuant): void {
        if ( !this.damageAccumulators.has(damage.type.superType) ) throw new Error(`Attempted to apply damage of type ${damage.type.superType} but no damage accumulator was found`)
        const currentDamage = this.damageAccumulators.get(damage.type.superType)!
        this.damageAccumulators.set(damage.type.superType, currentDamage + damage.quantity)
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : string[] {
        let values = new Array<string>()
        for (let [key, value] of this.sources) {
            values.push(value.transit())
        }
        return values
    }

    save() : string[] {
        let values = new Array<string>()
        for (let [key, value] of this.sources) {
            values.push(value.save())
        }
        return values
    }
}