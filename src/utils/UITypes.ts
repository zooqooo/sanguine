import { transitCharacter, transitGame, transitItem, transitLocation } from "../../server/_types/TransitTypes"

export type UIImage = string

export type UISprite = {
    sheet: {
        key: UIImage,
        frameWidth: number,
        frameHeight: number
    },
    frame: number
}

export type UICharacter = transitCharacter

export type UIGame = transitGame

export type UIItem = transitItem

export type UILocation = transitLocation