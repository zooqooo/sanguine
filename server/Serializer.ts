import localforage from "localforage"

import SanguineCharacter, { serializedCharacter } from "./Character"
import Region from "./locations/Region"
import { serializedTile } from "./locations/Tile"
import { DUMMY_SAVE } from "./_data/PLAYER_DATA"

export type serializedGame = { character: serializedCharacter, region: serializedTile[] }

const VERSION = `003`

export default class Serializer {
    private address: string
    private character!: serializedCharacter
    private region!: serializedTile[]
    
    constructor(playerName: string, characterName: string) {
        this.address = `SAVEV${VERSION}_${characterName}`
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

    async loadTestGame() {
        this.character = DUMMY_SAVE.character
        this.region = DUMMY_SAVE.region
        return this
    }

    async loadGame() {
        try {
            const value = await localforage.getItem(this.address) as serializedGame
            if ( value !== null ) {
                console.log(value)
                this.character = value.character
                this.region = value.region
            } else {
                console.log(`loading dummy data`)
                this.character = DUMMY_SAVE.character
            this.region = DUMMY_SAVE.region
            }
        } catch (err) {
            console.log(err)
            console.log(`loading dummy data`)
            this.character = DUMMY_SAVE.character
            this.region = DUMMY_SAVE.region
        } finally {
            return this
        }
    }
}