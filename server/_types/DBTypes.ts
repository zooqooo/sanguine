import { serializedStatBonus } from "../actor_stats/StatBonus"
import { serializedLootTable } from "../inventory/LootTable"

export enum itemTypeEnum {
    Ingredients_Base,
    Ingredients_Sated_Tincture,
    Ingredients_Pure_Tincture,
    Goods_Base,
    Goods_Jugan_Stone,
    Alchemical_Product,
    Gear_Accessory,
    Gear_Armor,
    Gear_Magic_Implement,
    Gear_Weapon
}

export type dbItem<T> = {
    name: string,
    sprite: {
        sheet: {
            key: string,
            frameWidth: number,
            frameHeight: number
        },
        frame: number
    }
    features: T
}

export type dbTile = {
    index: number,
    name: string,
    background: string,
    allowForage: boolean,
    allowCollect: boolean,
    forageTable: serializedLootTable,
    collectTable: serializedLootTable,
}

export type dbBonusSource = {
    name: string,
    statBonuses: serializedStatBonus[]
}