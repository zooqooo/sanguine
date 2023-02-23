import localforage from "localforage"

import SanguineCharacter, { serializedCharacter } from "./Character"
import Region from "./locations/Region"
import { serializedTile } from "./locations/Tile"

export type serializedGame = { character: serializedCharacter, region: serializedTile[] }

const VERSION = `001`

export default class Serializer {
    private address: string
    private character: serializedCharacter
    private region: serializedTile[]
    
    constructor(game: serializedGame) {
        this.address = `SAVEV${VERSION}_${game.character.name}`
        this.character = game.character
        this.region = game.region
    }

     /* -----------------------------
                GETTERS
    ----------------------------- */

    getSerializedCharacter() : serializedCharacter {
        return this.character
    }

    getSerializedRegion() : serializedTile[] {
        return this.region
    }
    
    getName() : string {
        return this.character.name
    }


    /* -----------------------------
                SETTERS
    ----------------------------- */

    /* -----------------------------
                SAVE
    ----------------------------- */

    save(character: SanguineCharacter, region: Region) {
        this.character = character.save()
        this.region = region.save()
        localforage.setItem(this.address, {character: this.character, region: this.region})
    }

    /* -----------------------------
                LOAD
    ----------------------------- */

    async loadGame() {
        //this.loadTestGame()

        try {
            const value = await localforage.getItem(this.address) as serializedGame
            if ( value !== null ) {
                console.log(value)
                this.character = value.character
                this.region = value.region
            }
        } catch (err) {
            console.log(err)
        }
    }
}