import SanguineCharacter from "../Character"
import Tile, { serializedTile } from "./Tile"

const INDEXED_COORDS: number[][] = [[0,0,0], [-1,1,0], [0,1,-1], [1,0,-1], [1,-1,0], [0,-1,1], [-1,0,1], [-2,2,0], [-1,2,-1], [0,2,-2], [1,1,-2], [2,0,-2], [2,-1,-1], [2,-2,0], [1,-2,1], [0,-2,2], [-1,-1,2], [-2,0,2], [-2,1,1], [-3,3,0], [-2,3,-1], [-1,3,-2], [0,3,-3], [1,2,-3], [2,1,-3], [3,0,-3], [3,-1,-2], [3,-2,-1], [3,-3,0], [2,-3,1], [1,-3,2], [0,-3,3], [-1,-2,3], [-2,-1,3], [-3,0,3], [-3,1,2], [-3,2,1]]

export default class Region {
    private tiles : Array<Tile>

    constructor(tiles: serializedTile[]) {
        let locations : Array<Tile> = []
        tiles.forEach( (info) => {
            locations.push(new Tile(info))
        })
        this.tiles = locations
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getIndex(index : number) : Tile {
        return this.tiles[index]
    }

    characterLocation(character: SanguineCharacter) : Tile {
        return this.getIndex(character.getLocation()!)
    }

    getNames() : string[] {
        let list: string[] = []

        this.tiles.forEach( (e) => {
            list.push(e.getName())
        })

        return list
    }

    isAdjacent(startingIndex : number, targetIndex: number) : boolean {
        let startingCoords = INDEXED_COORDS[startingIndex]
        let targetCoords = INDEXED_COORDS[targetIndex]
        let distance = (Math.abs(startingCoords[0]-targetCoords[0])+Math.abs(startingCoords[1]-targetCoords[1])+Math.abs(startingCoords[2]-targetCoords[2]))/2

        return distance == 1
    }
    
    /* -----------------------------
            GAME LOGIC
    ----------------------------- */

    /* -----------------------------
                SAVE
    ----------------------------- */

    save() : serializedTile[] {
        let list : serializedTile[] = []

        this.tiles.forEach( (e) => {
            list.push(e.save())
        })

        return list
    }
}