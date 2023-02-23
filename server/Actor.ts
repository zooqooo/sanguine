import ActorStats from "./actor_stats/ActorStats"
import BonusSource from "./actor_stats/BonusSource"
import Inventory from "./inventory/Inventory"
import Item, { serializedItem } from "./inventory/Item"
import { DamageBaseTypeEnum, damageType, StatTypeEnum } from "./_types/StatTypes"

var sigmoid = require('sigmoid')

export type serializedActor = {
    name: string,
    inventory?: serializedItem[],
    bonusSources?: string[]
}

export default class SanguineActor {
    protected name: string
    protected inventory: Inventory
    protected stats: ActorStats

    constructor(params: serializedActor) {
        this.name = params.name

        if (typeof params.inventory == 'undefined') {
            this.inventory = new Inventory()
        } else {
            this.inventory = new Inventory(params.inventory)
        }

        this.stats = new ActorStats()

        if (typeof params.bonusSources !== 'undefined') {
            params.bonusSources.forEach( (e) => {
                this.stats.addSource(new BonusSource(e))
            })
        }
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getName() : string {
        return this.name
    }

    getInventory() : Inventory {
        return this.inventory
    }

    getStats() : Map<string, number> {
        return this.stats.getStatValues()
    }

    getStat(name: StatTypeEnum, damageType?: damageType) : number {
        return this.stats.getStatQuant(name, damageType)
    }

    /* -----------------------------
              INVENTORY
    ----------------------------- */
    
    addToInventory(item: Item) : Inventory {
        this.inventory.addItem(item)
        return this.inventory
    }

    addMultipleToInventory(items: Item[]) : Inventory {
        items.forEach( (item) => {
            this.addToInventory(item)
        })
        return this.inventory
    }

    /* -----------------------------
                BONUSES
    ----------------------------- */

    addBonusSource(source: BonusSource): void {
        this.stats.addSource(source)
    }

    addMultipleBonusSources(sources: BonusSource[]): void {
        sources.forEach( (source) => {
            this.addBonusSource(source)
        })
    }

    addBonusSourceByName(source: string): void {
        this.addBonusSource(new BonusSource(source))
    }

    addMultipleBonusSourcesByName(sources: string[]): void {
        sources.forEach( (source) => {
            this.addBonusSourceByName(source)
        })
    }

    removeBonusSource(source: BonusSource): void {
        this.stats.removeSource(source)
    }

    removeMultipleBonusSources(sources: BonusSource[]): void {
        sources.forEach( (source) => {
            this.removeBonusSource(source)
        })
    }

    removeBonusSourceByName(source: string): void {
        this.removeBonusSource(new BonusSource(source))
    }

    removeMultipleBonusSourcesByName(sources: string[]): void {
        sources.forEach( (source) => {
            this.removeBonusSourceByName(source)
        })
    }

    /* -----------------------------
               GAME LOGIC
    ----------------------------- */

    performTrial(statName: StatTypeEnum, difficulty: number ): boolean {
        const stat = this.getStat(statName)
        const delta = ( stat - difficulty ) / 10
        const prob = sigmoid(delta)
        const roll = Math.random()
        return prob > roll
    }
}