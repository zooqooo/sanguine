import { transitItem } from "../_types/TransitTypes";
import Item, { serializedItem } from "./Item";

export default class Inventory {
    private items: Map<string, Item>

    constructor(inventory?: serializedItem[]) {
        this.items = new Map<string, Item>
        if (typeof inventory == 'undefined') return

        inventory.forEach( (e) => {
            this.items.set(e.id, new Item(e))
        })
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getItemQuantity(id: string) : number {
        if (!this.items.has(id)) return 0
        return this.items.get(id)!.getQuantity()
    }
    
    /* -----------------------------
            GAME LOGIC
    ----------------------------- */

    add(item: Item) : Inventory {
        if (!this.items.has(item.getID())) {
            this.items.set(item.getID(), new Item({ id: item.getID(), quantity: item.getQuantity()}))
            return this
        }

        let inventoryItem = this.items.get(item.getID())
        inventoryItem?.addQuantity(item.getQuantity())
        return this
    }

    addMultiple(items: Item[]) : Inventory {
        items.forEach( (item) => {
            this.add(item)
        })
        return this
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit(): transitItem[] {
        let list : transitItem[] = []

        this.items.forEach( (e) => {
            list.push(e.transit())
        })

        return list
    }

    save(): serializedItem[] {
        let list : serializedItem[] = []

        this.items.forEach( (e) => {
            list.push(e.save())
        })

        return list
    }
}