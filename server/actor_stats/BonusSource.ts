import DataManager from "../DataManager"
import { dbBonusComponent, dbBonusSource } from "../_types/DBTypes"

export default class BonusSource {
    private name!: string
    private bonuses!: dbBonusComponent[]

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
        this.bonuses = new Array<dbBonusComponent>()
        this.name = bonusSourceInfo.name
        for ( const bonusComponent of bonusSourceInfo.bonuses ) {
            this.bonuses.push(bonusComponent)
        }
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    getID() : string {
        return this.name
    }
    
    getBonuses() : dbBonusComponent[] {
        return this.bonuses
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