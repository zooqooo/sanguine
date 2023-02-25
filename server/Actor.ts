import ActorStats from "./actor_stats/ActorStats"
import BonusSource from "./actor_stats/BonusSource"
import Inventory from "./inventory/Inventory"
import { serializedItem } from "./inventory/Item"

export type serializedActor = {
    name: string,
    inventory?: serializedItem[],
    bonusSources?: string[]
}

export default class SanguineActor {
    protected name: string
    readonly inventory: Inventory
    readonly stats: ActorStats

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
                this.stats.addSource(BonusSource.fromName(e))
            })
        }
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getName() : string {
        return this.name
    }
}