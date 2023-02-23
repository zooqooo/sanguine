import SanguineGameMediator from "../GameMediator"
import { transitLocation } from "../_types/TransitTypes"
import LootTable from "../inventory/LootTable"
import Item from "../inventory/Item"

export type serializedTile = {
    id: number,
    bounty?: number
}

export default class Tile {
    private id: number
    private name: string
    private background: string
    private allowForage : boolean
    private allowCollect: boolean
    private forageTable: LootTable
    private collectTable: LootTable
    private bounty: number

    constructor(tile: serializedTile) {
        let mediator = SanguineGameMediator.getInstance()
        let tileInfo = mediator.getTileData(tile.id)
        if ( typeof tileInfo == 'undefined') throw new Error(`Tile info not found for ${tile.id}`)

        this.id = tile.id
        this.name = tileInfo.name
        this.background = tileInfo.background
        this.forageTable = new LootTable(tileInfo.forageTable)
        this.collectTable = new LootTable(tileInfo.collectTable)
        this.allowForage = tileInfo.allowForage
        this.allowCollect = tileInfo.allowCollect
        this.bounty = tile.bounty? tile.bounty! : 3
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getID() : number {
        return this.id
    }
    
    getName() : string {
        return this.name
    }

    getBackground() : string {
        return this.background
    }

    getBounty() : number {
        return this.bounty
    }

    /* -----------------------------
            GAME LOGIC
    ----------------------------- */

    gatherBounty() : number {
        this.bounty--
        return this.bounty
    }

    forage(action: "Forage" | "Collect") : Item[] | string {
        const allow = action == "Forage" ? this.allowForage : this.allowCollect
        const error = action == "Forage" ? `This location cannot be foraged` : `This location cannot be collected from`
        if ( this.bounty < 1 || !allow ) return `This location cannot be foraged`
        this.gatherBounty()
        const table = action == "Forage" ? this.forageTable : this.collectTable
        const tileDrops = table.lootDrop()
        return tileDrops
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : transitLocation {
        return { index: this.id, name: this.name, background: this.background, bounty: this.bounty }
    }

    save() : serializedTile {
        return {
            id: this.id,
            bounty: this.bounty
        }
    }
}