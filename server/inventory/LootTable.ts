import Item, { serializedItem } from "./Item";

export type serializedLootTable = { drops: serializedItem[], chance: number }[]

export default class LootTable {
    private table: { drops: serializedItem[], chance: number }[]
    private items!: Array<Array<serializedItem>>
    private weights!: Array<number>

    constructor(lootTable: serializedLootTable) {
        this.table = lootTable

        this.updateWeights()
    }

    updateWeights() {
        this.items = []
        this.weights = []

        this.table.forEach( (item) => {
            this.items.push(item.drops)
            this.weights.push(item.chance)
        })
        
        for (let i = 1; i < this.weights.length; i++) {
            this.weights[i] += this.weights[i - 1]
        }
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */
    
    /* -----------------------------
            GAME LOGIC
    ----------------------------- */

    lootDrop() : Item[] {
        let random = Math.random() * this.weights[this.weights.length - 1]
    
        for (let i = 0; i < this.weights.length; i++) {
            if (this.weights[i] > random) {
                return Item.serializedtoItems(this.items[i])
            }
        }
        
        return []
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    save() : serializedLootTable {
        return this.table
    }
}