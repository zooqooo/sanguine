import { dbBonusSource } from "../_types/DBTypes"
import { QuantTypeEnum, StatTypeEnum } from "../_types/StatTypes"

export const BONUS_SOURCES : Array<dbBonusSource> = [
    {
        name: "Sanguine Hero",
        statBonuses: [
            {
                stat: StatTypeEnum.Vigor,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Sanguine Explorer",
        statBonuses: [
            {
                stat: StatTypeEnum.Agility,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Vigor,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Sanguine Inquisitor",
        statBonuses: [
            {
                stat: StatTypeEnum.Spirit,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Presence,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Hammer Anima",
        statBonuses: [
            {
                stat: StatTypeEnum.Vigor,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Axe Anima",
        statBonuses: [
            {
                stat: StatTypeEnum.Vigor,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Spear Anima",
        statBonuses: [
            {
                stat: StatTypeEnum.Agility,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Sanguine Knight",
        statBonuses: [
            {
                stat: StatTypeEnum.Vigor,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Agility,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Sanguine Monk",
        statBonuses: [
            {
                stat: StatTypeEnum.Spirit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Presence,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Sanguine Ranger",
        statBonuses: [
            {
                stat: StatTypeEnum.Agility,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Grit,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Presence,
                quantity: 1,
                quantType: QuantTypeEnum.Add
            }
        ]
    }
]

