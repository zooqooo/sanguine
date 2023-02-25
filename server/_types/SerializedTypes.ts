import { damageType, QuantTypeEnum, StatTypeEnum } from "./StatTypes"

export type serializedActor = {
    name: string,
    inventory?: serializedItem[],
    bonusSources?: string[]
}

export type serializedCharacter = {
    name: string,
    location: number,
    initialized: boolean,
    inventory?: serializedItem[],
    bonusSources?: string[]
}

export type serializedItem = { id: string, quantity: number }

export type serializedTile = {
    id: number,
    bounty?: number
}

export type serializedGame = { character: serializedCharacter, region: serializedTile[] }

export type serializedStatBonus = {
    stat: StatTypeEnum,
    quantity: number,
    quantType: QuantTypeEnum,
    quantMult?: StatTypeEnum,
    damageType?: damageType
}

export type serializedLootTable = { drops: serializedItem[], chance: number }[]