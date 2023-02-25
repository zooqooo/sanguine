import { INGREDIENTS_BASE } from "./Items/ITEMS_INGREDIENTS_BASE"

export type UISprite = {
    sheet: {
        key: string,
        frameWidth: number,
        frameHeight: number
    },
    frame: number
}

export type dbSprite = {
    name: string,
    sprite: UISprite
}

export const SPRITE_SHEETS: Array<Array<dbSprite>> = [
    INGREDIENTS_BASE,
]

