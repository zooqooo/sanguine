import { dbItem, itemTypeEnum } from "../_types/DBTypes"
import { ItemFeature } from "../_types/ItemTypes"
import { INGREDIENTS_BASE } from "./Items/ITEMS_INGREDIENTS_BASE"

export const ITEMS: Array<Array<dbItem<ItemFeature>>> = [
    INGREDIENTS_BASE,
]



