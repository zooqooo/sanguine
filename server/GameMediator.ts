import { TILES } from "./_data/TILES_DATA"
import { ITEMS } from "./_data/ITEMS_DATA"
import { DAMAGE_ACCUMULATORS, STAT_TYPES } from "./_data/STAT_TYPES_DATA"
import { BONUS_SOURCES } from "./_data/BONUS_SOURCES_DATA"
import { PLAYERS } from "./_data/PLAYER_DATA"

import { dbBonusSource, dbItem, dbTile } from "./_types/DBTypes"
import { damageAccumulatorInfo, DamageSuperTypeEnum, statInfo, StatTypeEnum } from "./_types/StatTypes"
import { ItemFeature } from "./_types/ItemTypes"

import Serializer from "./Serializer"
import SanguineGame from "./Game"

let instance: SanguineGameMediator

export default class SanguineGameMediator {
    private games: SanguineGame[]
    private tiles: Map<number, dbTile>
    private items: Map<string, dbItem<ItemFeature>>
    private statTypes: Map<StatTypeEnum, statInfo>
    private damageAccumulators: Map<DamageSuperTypeEnum, damageAccumulatorInfo> 
    private bonusSources: Map<string, dbBonusSource>

    constructor() {
        this.games = new Array<SanguineGame>()

        this.tiles = new Map<number, dbTile>()
        for (const tile of TILES) {
            if (this.tiles.has(tile.index)) throw new Error(`Index intersection in TILES data object, index ${tile.index}`)
            this.tiles.set(tile.index, tile)
        }

        this.items = new Map<string, dbItem<ItemFeature>>()
        for (const item_sheet of ITEMS) {
            for (const item of item_sheet) {
                if (this.items.has(item.name)) throw new Error(`Index intersection in ITEMS data object, index ${item.name}`)
                this.items.set(item.name, item)
            }
        }

        this.statTypes = new Map<StatTypeEnum, statInfo>()
        for (const type of STAT_TYPES) {
            if (this.statTypes.has(type.name)) throw new Error(`Index intersection in STAT_TYPES data object, index ${StatTypeEnum[type.name]}`)
            this.statTypes.set(type.name, type)
        }

        this.damageAccumulators = new Map<DamageSuperTypeEnum, damageAccumulatorInfo>()
        for (const accumulator of DAMAGE_ACCUMULATORS) {
            if (this.damageAccumulators.has(accumulator.damageSuperType)) throw new Error(`Index intersection in STAT_TYPES data object, index ${StatTypeEnum[accumulator.damageSuperType]}`)
            this.damageAccumulators.set(accumulator.damageSuperType, accumulator)
        }

        this.bonusSources = new Map<string, dbBonusSource>()
        for (const source of BONUS_SOURCES) {
            if (this.bonusSources.has(source.name)) throw new Error(`Index intersection in BONUS_SOURCES data object, index ${source.name}`)
            this.bonusSources.set(source.name, source)
        }

    }

    static getInstance(): SanguineGameMediator {
        if (typeof instance == "undefined") {
            instance = new SanguineGameMediator()
        }
        return instance
    }

    getCharactersFromPassword(password: string): { name: string, characterNames: string[] } | "Invalid Password" {
        const players = PLAYERS

        if (players[password] == null) {
            return "Invalid Password"
        } else {
            const player = players[password]
            const characters = []
            for ( const character of player.saves ) {
                characters.push(character)
            }
            return { name: player.name, characterNames: characters}
        }
    }

    async createTestGame(): Promise<SanguineGame> {
        let serializer = new Serializer("testDFGData", "testDFGData")
        serializer = await serializer.loadTestGame()
        return this.createGame(serializer)
    }

    async createGameFromCharacter(password: string, characterName: string): Promise<SanguineGame | "Invalid Password" | "Invalid Character"> {
        const players = PLAYERS

        if (players[password] == null) return "Invalid Password"

        const player = players[password]
        for ( const character of player.saves ) {
            if ( character == characterName) {
                let serializer = new Serializer(player.name, character)
                serializer = await serializer.loadGame()
                return this.createGame(serializer)
            }
        }
        return "Invalid Character"
    }

    createGame(serializer: Serializer): SanguineGame {
        console.log(serializer)
        const game = new SanguineGame(serializer)
        this.games.push(game)
        return game
    }

    getAllStats(): StatTypeEnum[] {
        const values = Object.keys(StatTypeEnum)
            .filter((v) => isNaN(Number(v)))
            .map((name) => {
                return StatTypeEnum[name as keyof typeof StatTypeEnum]
            });
        return values 
    }

    getTileData( index: number ): dbTile | undefined {
        return this.tiles.get(index)
    }

    getItemData( name: string ): dbItem<ItemFeature> | undefined {
        return this.items.get(name)
    }

    getStatTypeData( name: StatTypeEnum ): statInfo | undefined {
        return this.statTypes.get(name)
    }

    getBonusSourceData( name: string ): dbBonusSource | undefined {
        return this.bonusSources.get(name)
    }
}