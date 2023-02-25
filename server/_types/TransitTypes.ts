import { dbItem } from "./DBTypes"

export type transitLocation = { index: number, name: string, background: string, bounty: number }

export type transitItem = {
    name: string,
    quantity: number
}

export type transitCharacter = {
    name: string,
    location: number,
    initialized: boolean,
    bonusSources: string[]
}

export type transitGame = {
    characterStatus: transitCharacter,
    location: transitLocation,
    inventory: transitItem[]
}