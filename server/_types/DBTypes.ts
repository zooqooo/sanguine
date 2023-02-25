import { serializedLootTable } from "./SerializedTypes"
import { statBonus } from "./StatTypes"

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
    bonuses: dbBonusComponent[]
}

export type dbBonusComponent = {
    stats: statBonus[]
}