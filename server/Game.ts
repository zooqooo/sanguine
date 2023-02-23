import Serializer from './Serializer'

import SanguineCharacter from "./Character"
import Inventory from './inventory/Inventory'
import Region from "./locations/Region"
import Tile from './locations/Tile'

import { transitGame, transitItem, transitLocation } from './_types/TransitTypes'
import Item from './inventory/Item'

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
                GETTERS
    ----------------------------- */

    getInventory() : Inventory {
        return this.character.getInventory()
    }

    getRegionNames() : string[] {
        return this.region.getNames()
    }

    /* -----------------------------
              START GAME
    ----------------------------- */
    
    startGame(): {gameState: transitGame, regionNames: string[]} {
        return { gameState: this.transit(), regionNames: this.getRegionNames() }
    }

    beginCharacterInitialize(): { classChoices: string[], weaponChoices: string [] } {
        return this.character.beginCharacterInitialize()
    }

    verifyCharacterInitialize(choices: { classChoice: number, weaponChoice: number }): transitGame {
        this.character.verifyCharacterInitialize(choices)
        return this.transit()
    }
    
    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    gatherBounty(action: "Forage" | "Collect"): { drops: string, bounty: number, inventory: transitItem[] } {
        let response: { drops: string, bounty: number, inventory: transitItem[] }
        if ( this.location.getBounty() == 0 ) {
            response = { drops: `This location has nothing left to gather.\r\nCome back later`, bounty: 0, inventory: this.getInventory().transit() }
        } else {
            const tileDrops : Item[] | string = this.location.forage(action)
            if (typeof tileDrops! == 'string') {
                response = { drops: tileDrops, bounty: this.location.getBounty(), inventory: this.getInventory().transit() }
            } else {
                //console.log(this.itemsToString(tileDrops, 'Found'))
                let inventory = this.character.addMultipleToInventory(tileDrops).transit()
                this.save()
                response = { drops: Item.itemsToString(tileDrops, 'Found'), bounty: this.location.getBounty(), inventory: inventory }
            }
        }
        return response
    }

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

    /* -----------------------------
            UTILITY METHODS
    ----------------------------- */



    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : transitGame{
        return {
            characterStatus: this.character.transit(),
            location: this.location.transit(),
            inventory: this.getInventory().transit()
        }
    }

    save() {
        //console.log('saving')
        this.serializer.save(this.character, this.region)
    }
}