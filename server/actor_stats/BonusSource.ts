import SanguineGameMediator from "../GameMediator"
import { dbBonusSource } from "../_types/DBTypes"
import StatBonus from "./StatBonus"

export default class BounusSource {
    private name: string
    private statBonuses: StatBonus[]

    constructor(name: string | dbBonusSource) {
        let bonusSourceInfo: dbBonusSource | undefined
        if ( typeof name == 'string' ) {
            let mediator = SanguineGameMediator.getInstance()
            bonusSourceInfo = mediator.getBonusSourceData(name as string)
            if ( typeof bonusSourceInfo == 'undefined') throw new Error(`Bonus Source info not found for ${name}`)
        } else {
            bonusSourceInfo = name as dbBonusSource
        }
        
        this.statBonuses = new Array<StatBonus>()
        this.name = bonusSourceInfo.name
        bonusSourceInfo.statBonuses.forEach( (b) => {
            this.statBonuses.push(new StatBonus(this, b))
        })
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