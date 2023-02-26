import DataManager from "../DataManager"
import { dbBonusComponent, dbBonusSource } from "../_types/DBTypes"
import { statBonus } from "../_types/StatTypes"

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

    getStatBonusesByContext(context: boolean): statBonus[] {
        let statBonuses: statBonus[] = []
        for ( const component of this.bonuses ) {
            if ( context ) {
                for ( const bonus of component.stats ) {
                    statBonuses.push(bonus)
                }
            }
        }
        return statBonuses
    }

    static filterBonusComponentsByContext(components: dbBonusComponent[], context: boolean): dbBonusComponent[] {
        let bonuses = new Array<dbBonusComponent>()
        for ( const component of components ) {
            if ( context ) {
                bonuses.push(component)
            }
        }
        return bonuses
    }

    static statBonusFromBonusComponent(components: dbBonusComponent[]): statBonus[] {
        let bonuses = new Array<statBonus>()
        for ( const component of components ) {
            bonuses.concat(component.stats)
        }
        return bonuses
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