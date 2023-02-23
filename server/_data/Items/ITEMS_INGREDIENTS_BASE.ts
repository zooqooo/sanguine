import { CST } from "../../../src/CST"
import { dbItem, itemTypeEnum } from "../../_types/DBTypes"
import { Ingredients_Base_Feature } from "../../_types/ItemTypes"

export const INGREDIENTS_BASE: Array<dbItem<Ingredients_Base_Feature>> = [
    {
        name: "Gold Thorn",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 1
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Thunder Thistle",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 2
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Wind Bloom",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 0
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Drift Seed",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 3
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Lava Root",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 4
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Blood Rose",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 5
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Obsidian Bark",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 6
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Uncommon Fern",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 7
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Tangle Weed",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 8
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Mud Nut",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 9
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Spring Berry",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 10
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    },
    {
        name: "Ice Fruit",
        sprite: {
            sheet: CST.SPRITE.FLOWER_ITEMS,
            frame: 11
        },
        features: {
            type: itemTypeEnum.Ingredients_Base
        }
    }
]
