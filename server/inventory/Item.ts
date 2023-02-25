import Pluralize from "pluralize"
import SanguineGameMediator from "../GameMediator"
import { transitItem } from "../_types/TransitTypes"

export type serializedItem = { id: string, quantity: number }

export default class Item {
    private name: string
    private quantity: number
    
    constructor(item: serializedItem) {
        let mediator = SanguineGameMediator.getInstance()
        let itemInfo = mediator.getItemData(item.id)
        if ( typeof itemInfo == 'undefined') throw new Error(`Item info not found for ${item.id}`)

        this.name = itemInfo.name
        this.quantity = item.quantity? item.quantity : 1
    }
    
    /* -----------------------------
            GETTERS
    ----------------------------- */

    getID(): string {
        return this.name
    }

    getName(): string {
        return this.name
    }

    getQuantity() : number {
        return this.quantity
    }

    toString() : string {
        return Pluralize(this.name, this.quantity, true)
    }

    /* -----------------------------
            GAME LOGIC
    ----------------------------- */

    addQuantity(quantity: number) {
        this.quantity += quantity
    }

    subtractQuantity(quantity: number) {
        this.quantity -= quantity
    }

    /* -----------------------------
               UTILITY
    ----------------------------- */

    static serializedtoItems(items: serializedItem[]) {
        let array: Array<Item> = []

        items.forEach( (e) => {
            array.push(new Item(e))
        })

        return array
    }

    static itemsToString(items: Item[], verb: string) {
        let messages: string[] = []
        items.forEach( (item) => {
            messages.push(`${verb} ${item.toString()}`)
        })
        return messages.join('\r\n')
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : transitItem {
        return { name: this.name, quantity: this.quantity }
    }

    save() : serializedItem {
        return { id: this.name, quantity: this.quantity }
    }
}