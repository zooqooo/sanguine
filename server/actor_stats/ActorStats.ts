import ActorStat from "./ActorStat"
import { damageType, ElementalTypeEnum, StatTypeEnum } from "../_types/StatTypes"
import BonusSource from "./BonusSource"
import SanguineGameMediator from "../GameMediator"

export default class ActorStats {
    private stats: Map<StatTypeEnum, ActorStat>
    private sources: Map<string, BonusSource>

    constructor(statNames?: StatTypeEnum[]) {
        this.stats = new Map<StatTypeEnum, ActorStat>()
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

    getStatNames() : string[] {
        let values = new Array<string>()
        this.stats.forEach( (e) => {
            values.push(e.getName())
        })
        return values
    }

    getStatValues() : Map<string, number> {
        let values = new Map<string, number>()

        this.stats.forEach( (e) => {
            if (!e.isDamageTyped()) {
                //there's no mechanism to retrieve the generic value of damage typed stats at this point
                values.set(e.getName(), e.get())
            }
        })
        return values
    }

    getStatQuant(name: StatTypeEnum, damageType?: damageType) : number {
        return this.getStat(name).get(damageType)
    }

    getStat(name: StatTypeEnum) : ActorStat {
        if ( !this.stats.has(name) ) throw new Error(`Attempted to fetch stat that isn't present ${StatTypeEnum[name]}`)
        return this.stats.get(name)!
    }

    getSources() : Map<string, BonusSource> {
        return this.sources
    }

    /* -----------------------------
              GAME LOGIC
    ----------------------------- */
    
    update() {
        this.stats.forEach( (e) => {
            e.update()
        })
        this.setStaticStats()
    }

    setStaticStats() {
        if ( this.stats.has(StatTypeEnum.Speed)) {
            let value = Math.sqrt(this.getStatQuant(StatTypeEnum.Agility)+this.getStatQuant(StatTypeEnum.Alacrity)+1)-1
            this.getStat(StatTypeEnum.Speed).set(value)
        }
    }

    setBaseArmor(armor: { armorValue: number, infusions: { type: ElementalTypeEnum, level: number }[] }) {
        const armorType = [ StatTypeEnum.Fire_Base_Armor, StatTypeEnum.Water_Base_Armor, StatTypeEnum.Air_Base_Armor, StatTypeEnum.Earth_Base_Armor, StatTypeEnum.Arcane_Base_Armor, StatTypeEnum.Null_Base_Armor ]
		this.getStat(StatTypeEnum.Physical_Base_Armor).set(armor.armorValue)
		armor.infusions.forEach( (e) => {
			let elementArmorValue = armor.armorValue * (e.level/(1+e.level))
            this.getStat(armorType[e.type]).set(elementArmorValue)
		})
	}

    addSource(source: BonusSource) {
        if ( this.sources.has(source.getID())) {
            throw new Error(`Attempted to add duplicate bonus source ${source.getID()}`)
        } else {
            this.sources.set(source.getID(), source)
            this.update()
        }
    }

    removeSource(source: BonusSource) {
        if ( this.sources.has(source.getID())) {
            this.sources.delete(source.getID())
            this.update()
        } else {
            throw new Error(`Attempted to remove non-existant bonus source ${source.getID()}`)
        }
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