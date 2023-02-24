import { damageAccumulatorInfo, DamageSuperTypeEnum, statInfo, StatStackingTypeEnum, StatTypeEnum } from "../_types/StatTypes"

const BASE_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Vigor,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
    },
    {
        name: StatTypeEnum.Grit,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
    },
    {
        name: StatTypeEnum.Agility,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
    },
    {
        name: StatTypeEnum.Spirit,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
    },
    {
        name: StatTypeEnum.Presence,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
    },
    {
        name: StatTypeEnum.Tenacity,
        stacking: StatStackingTypeEnum.Arithmetic,
    },
    {
        name: StatTypeEnum.Alacrity,
        stacking: StatStackingTypeEnum.Arithmetic,
    }
]

const BASE_ARMOR_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Physical_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Fire_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Water_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Air_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Earth_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Arcane_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    },
    {
        name: StatTypeEnum.Null_Base_Armor,
        stacking: StatStackingTypeEnum.None,
    }
]

const CONSTITUTION_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Max_Stamina,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Stamina_Regen,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Max_Tension,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Tension_Recovery,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Exhaustion_Recovery,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Dread_Recovery,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    }
]

const REBUFF_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Evasion,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Discipline,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Mettle,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    },
    {
        name: StatTypeEnum.Pluck,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0
    }
]

const OTHER_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Initiative,
        stacking: StatStackingTypeEnum.Further
    }
]

const DEFENSIVE_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Protection,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: -2,
        hasMax: true,
        max: 1,
        linearOnly: true,
        damageTyped: true
    },
    {
        name: StatTypeEnum.Resistance,
        stacking: StatStackingTypeEnum.Further,
        damageTyped: true
    },
    {
        name: StatTypeEnum.Armor,
        stacking: StatStackingTypeEnum.Arithmetic,
        damageTyped: true
    }
]

const ATTACK_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Accuracy,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0,
        linearOnly: true
    },
    {
        name: StatTypeEnum.Critical_Chance,
        stacking: StatStackingTypeEnum.Further
    },
    {
        name: StatTypeEnum.Critical_Stamina_Damage,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0,
        linearOnly: true,
        noPenalty: true
    },
    {
        name: StatTypeEnum.Critical_Tension_Damage,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0,
        linearOnly: true,
        noPenalty: true
    },
    {
        name: StatTypeEnum.Max_Damage,
        stacking: StatStackingTypeEnum.Arithmetic,
        damageTyped: true
    },
    {
        name: StatTypeEnum.Bonus_Damage,
        stacking: StatStackingTypeEnum.Arithmetic,
        damageTyped: true
    },
    {
        name: StatTypeEnum.Advantage,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0,
        linearOnly: true,
        noPenalty: true,
        damageTyped: true
    },
    {
        name: StatTypeEnum.Disadvantage,
        stacking: StatStackingTypeEnum.Arithmetic,
        hasMin: true,
        min: 0,
        linearOnly: true,
        noPenalty: true,
        damageTyped: true
    }
]

const STATIC_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.Max_Vitality,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Exhaustion_Limit_1,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Exhaustion_Limit_2,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Exhaustion_Limit_3,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Dread_Limit_1,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Dread_Limit_2,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Dread_Limit_3,
        stacking: StatStackingTypeEnum.None
    },
    {
        name: StatTypeEnum.Speed,
        stacking: StatStackingTypeEnum.None
    }
]

const TEST_STATS: Array<statInfo> = [
    {
        name: StatTypeEnum.TEST_POSITIVE_LINEAR,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
        noPenalty: true
    },
    {
        name: StatTypeEnum.TEST_MIN_MAX_LINEAR,
        stacking: StatStackingTypeEnum.Arithmetic,
        linearOnly: true,
        hasMin: true,
        min: -2,
        hasMax: true,
        max: 1
    },
    {
        name: StatTypeEnum.TEST_FURTHER,
        stacking: StatStackingTypeEnum.Further,
    }
]

export const STAT_TYPES: Array<statInfo> = new Array<statInfo>().concat(
    BASE_STATS,
    BASE_ARMOR_STATS,
    CONSTITUTION_STATS,
    REBUFF_STATS,
    DEFENSIVE_STATS,
    ATTACK_STATS,
    OTHER_STATS,
    STATIC_STATS,
    TEST_STATS,
    [ { name: StatTypeEnum.None, stacking: StatStackingTypeEnum.None, } ]
)

export const DAMAGE_ACCUMULATORS: damageAccumulatorInfo[] = [
    {
        damageSuperType: DamageSuperTypeEnum.Stamina,
    },
    {
        damageSuperType: DamageSuperTypeEnum.Tension,
    },
    {
        damageSuperType: DamageSuperTypeEnum.Dread,
    },
    {
        damageSuperType: DamageSuperTypeEnum.Stall,
    },
    {
        damageSuperType: DamageSuperTypeEnum.Exhaustion,
    }
]