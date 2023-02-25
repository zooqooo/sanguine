import Serializer from './Serializer'

import SanguineCharacter from "./Character"
import Region from "./locations/Region"
import Tile from './locations/Tile'
import Item from './inventory/Item'

import { transitGame, transitItem, transitLocation } from './_types/TransitTypes'

export default class SanguineGame {
    private serializer: Serializer

    private character: SanguineCharacter
    private region: Region
    private location: Tile

    constructor(serializer: Serializer) {
        this.serializer = serializer

        this.character = new SanguineCharacter(this.serializer.getSerializedCharacter())
        this.region = new Region(this.serializer.getSerializedRegion())
        this.location = this.region.characterLocation(this.character)
    }
    
    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    startGame(): {gameState: transitGame, regionNames: string[]} {
        return { gameState: this.transit(), regionNames: this.region.getNames() }
    }

    /* ----   RESPAWN    ---- */

    beginCharacterInitialize(): { classChoices: string[], weaponChoices: string [] } {
        return this.character.beginCharacterInitialize()
    }

    verifyCharacterInitialize(choices: { classChoice: number, weaponChoice: number }): transitGame {
        this.character.verifyCharacterInitialize(choices)
        return this.transit()
    }

    /* ----   MOVE    ---- */

    move(targetIndex: number): transitLocation | "Invalid Move" {     
        if ( this.region.isAdjacent(this.location.getID(), targetIndex) ) {
            let tile = this.region.getIndex(targetIndex)     
            this.character.setLocation(tile.getID())
            let newLocation = this.region.characterLocation(this.character)
            this.location = newLocation
            this.save()
            return this.location.transit()
        } else {
            return "Invalid Move"
        }
    }

    /* ----   BOUNTY    ---- */

    gatherBounty(action: "Forage" | "Collect"): { drops: string, bounty: number, inventory: transitItem[] } {
        let response: { drops: string, bounty: number, inventory: transitItem[] }
        if ( this.location.getBounty() == 0 ) {
            response = { drops: `This location has nothing left to gather.\r\nCome back later`, bounty: 0, inventory: this.character.inventory.transit() }
        } else {
            const tileDrops : Item[] | string = this.location.forage(action)
            if (typeof tileDrops! == 'string') {
                response = { drops: tileDrops, bounty: this.location.getBounty(), inventory: this.character.inventory.transit() }
            } else {
                //console.log(this.itemsToString(tileDrops, 'Found'))
                let inventory = this.character.inventory.addMultiple(tileDrops).transit()
                this.save()
                response = { drops: Item.itemsToString(tileDrops, 'Found'), bounty: this.location.getBounty(), inventory: inventory }
            }
        }
        return response
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : transitGame{
        return {
            characterStatus: this.character.transit(),
            location: this.location.transit(),
            inventory: this.character.inventory.transit()
        }
    }

    save() {
        //console.log('saving')
        this.serializer.save(this.character, this.region)
    }
}