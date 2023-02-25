import { TILES } from "./_data/TILES_DATA"
import { ITEMS } from "./_data/ITEMS_DATA"
import { DAMAGE_ACCUMULATORS, STAT_TYPES } from "./_data/STAT_TYPES_DATA"
import { BONUS_SOURCES } from "./_data/BONUS_SOURCES_DATA"

import { dbBonusSource, dbItem, dbTile } from "./_types/DBTypes"
import { damageAccumulatorInfo, DamageSuperTypeEnum, statInfo, StatTypeEnum } from "./_types/StatTypes"
import { ItemFeature } from "./_types/ItemTypes"

let instance: DataManager

export default class DataManager {
    private tiles: Map<number, dbTile>
    private items: Map<string, dbItem<ItemFeature>>
    private statTypes: Map<StatTypeEnum, statInfo>
    private damageAccumulators: Map<DamageSuperTypeEnum, damageAccumulatorInfo> 
    private bonusSources: Map<string, dbBonusSource>

    constructor() {
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

    static getInstance(): DataManager {
        if (typeof instance == "undefined") {
            instance = new DataManager()
        }
        return instance
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