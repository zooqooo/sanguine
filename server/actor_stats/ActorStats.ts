import ActorStat from "./ActorStat"
import { damageQuant, DamageSuperTypeEnum, damageType, ElementalTypeEnum, StatTypeEnum } from "../_types/StatTypes"
import BonusSource from "./BonusSource"
import SanguineGameMediator from "../GameMediator"
import StatBonus from "./StatBonus"

var sigmoid = require('sigmoid')

export default class ActorStats {
    private stats: Map<StatTypeEnum, ActorStat>
    private damageAccumulators: Map<DamageSuperTypeEnum, number> 
    private sources: Map<string, BonusSource>

    constructor(statNames?: StatTypeEnum[]) {
        this.stats = new Map<StatTypeEnum, ActorStat>()
        this.damageAccumulators = new Map<DamageSuperTypeEnum, number>()
        this.sources = new Map<string, BonusSource>()

        if (typeof statNames == 'undefined') {
            let mediator = SanguineGameMediator.getInstance()
            statNames = mediator.getAllStats()
        }

        statNames.forEach( (e) => {
            let stat = new ActorStat(this, e)
            this.stats.set(e, stat)
        })
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    getStat(name: StatTypeEnum): ActorStat {
        if ( !this.stats.has(name) ) throw new Error(`Attempted to fetch stat that isn't present ${StatTypeEnum[name]}`)
        return this.stats.get(name)!
    }

    getStatValue(name: StatTypeEnum, damageType?: damageType): number {
        return this.getStat(name).get(damageType)
    }

    getInstantStatValue(name: StatTypeEnum, bonuses: StatBonus[], damageType?: damageType): number {
        return this.getStat(name).getInstant(bonuses, damageType)
    }
    
    getStatValues(): Map<string, number> {
        let values = new Map<string, number>()

        this.stats.forEach( (e) => {
            if (!e.isDamageTyped()) {
                //there's no mechanism to retrieve the generic value of damage typed stats at this point
                values.set(e.getName(), e.get())
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
        this.addSource(new BonusSource(source))
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
        this.removeSource(new BonusSource(source))
    }

    removeMultipleBonusSourcesByName(sources: string[]): void {
        sources.forEach( (source) => {
            this.removeSourceByName(source)
        })
    }

    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    /* ----   UPDATE    ---- */
    
    update(): void {
        this.stats.forEach( (e) => {
            e.update()
        })
        this.setStaticStats()
    }

    setStaticStats(): void {
        if ( this.stats.has(StatTypeEnum.Speed)) {
            let value = Math.sqrt(this.getStatValue(StatTypeEnum.Agility)+this.getStatValue(StatTypeEnum.Alacrity)+1)-1
            this.getStat(StatTypeEnum.Speed).set(value)
        }
    }

    /* ----   SOURCES    ---- */
    
    setBaseArmor(armor: { armorValue: number, infusions: { type: ElementalTypeEnum, level: number }[] }): void {
        const armorType = [ StatTypeEnum.Fire_Base_Armor, StatTypeEnum.Water_Base_Armor, StatTypeEnum.Air_Base_Armor, StatTypeEnum.Earth_Base_Armor, StatTypeEnum.Arcane_Base_Armor, StatTypeEnum.Null_Base_Armor ]
		this.getStat(StatTypeEnum.Physical_Base_Armor).set(armor.armorValue)
		armor.infusions.forEach( (e) => {
			let elementArmorValue = armor.armorValue * (e.level/(1+e.level))
            this.getStat(armorType[e.type]).set(elementArmorValue)
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