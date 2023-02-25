import { serializedCharacter } from "../Character"
import { serializedTile } from "../locations/Tile"
import { serializedGame } from "../Serializer"

export type player = {
    name: string,
    password: string,
    maxCharacters: number,
    saves: string[]
}

const DUMMY_REGION: serializedTile[]  = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 }
]

const TEST_PLAYER: player = {
    name: 'Robin',
    password: 'test',
    maxCharacters: 10,
    saves: [
        "Dick",
        "Tim",
        "Jason"
    ]
}

export var PLAYERS: {[key: string]: player} = {
    "test": TEST_PLAYER
}

export const DUMMY_CHARACTER: serializedCharacter = {
    name: 'Test Character',
    location: 0,
    initialized: false,
    bonusSources: [
        
    ]
}

export const DUMMY_SAVE: serializedGame = {
    character: DUMMY_CHARACTER,
    region: DUMMY_REGION
}