import { dbBonusSource } from "../_types/DBTypes"
import { QuantTypeEnum, StatTypeEnum } from "../_types/StatTypes"

export const BONUS_SOURCES : Array<dbBonusSource> = [
    {
        name: "Sanguine Hero",
        bonuses: [{
            stats: [
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
        }]
    },
    {
        name: "Sanguine Explorer",
        bonuses: [{
            stats: [
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
        }]
    },
    {
        name: "Sanguine Inquisitor",
        bonuses: [{
            stats: [
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
        }]
    },
    {
        name: "Hammer Anima",
        bonuses: [{
            stats: [
                {
                    stat: StatTypeEnum.Vigor,
                    quantity: 1,
                    quantType: QuantTypeEnum.Add
                }
            ]
        }]
    },
    {
        name: "Axe Anima",
        bonuses: [{
            stats: [
                {
                    stat: StatTypeEnum.Vigor,
                    quantity: 1,
                    quantType: QuantTypeEnum.Add
                }
            ]
        }]
    },
    {
        name: "Spear Anima",
        bonuses: [{
            stats: [
                {
                    stat: StatTypeEnum.Agility,
                    quantity: 1,
                    quantType: QuantTypeEnum.Add
                }
            ]
        }]
    },
    {
        name: "Sanguine Knight",
        bonuses: [{
            stats: [
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
        }]
    },
    {
        name: "Sanguine Monk",
        bonuses: [{
            stats: [
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
        }]
    },
    {
        name: "Sanguine Ranger",
        bonuses: [{
            stats: [
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
        }]
    }
]

