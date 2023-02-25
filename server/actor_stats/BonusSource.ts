import DataManager from "../DataManager"
import { dbBonusSource } from "../_types/DBTypes"
import StatBonus from "./StatBonus"

export default class BonusSource {
    private name!: string
    private statBonuses!: StatBonus[]

    static fromName(name: string): BonusSource {
        const bonusSourceInfo = DataManager.getInstance().getBonusSourceData(name as string)
        if ( typeof bonusSourceInfo == 'undefined') throw new Error(`Bonus Source info not found for ${name}`)

        const source = new BonusSource()
        source.setBonusInfo(bonusSourceInfo)
        return source
    }

    static fromSerial(bonusSourceInfo: dbBonusSource) {
        const source = new BonusSource()
        source.setBonusInfo(bonusSourceInfo)
        return source
    }

    setBonusInfo(bonusSourceInfo: dbBonusSource) {
        this.statBonuses = new Array<StatBonus>()
        this.name = bonusSourceInfo.name
        for ( const bonusComponent of bonusSourceInfo.bonuses ) {
            for ( const statBonus of bonusComponent.stats ) {
                this.statBonuses.push(new StatBonus(this.name, statBonus))
            }
        }
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    getID() : string {
        return this.name
    }
    
    getBonuses() : StatBonus[] {
        return this.statBonuses
    }

    /* -----------------------------
                  SAVE
    ----------------------------- */

    transit() : string {
        return this.getID()
    }

    save() : string {
        return this.getID()
    }
}