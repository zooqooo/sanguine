import { dbBonusSource } from "../../server/_types/DBTypes";
import { DamageBaseTypeEnum, DamageSuperTypeEnum, QuantTypeEnum, StatTypeEnum } from "../../server/_types/StatTypes";

export const MOCK_BONUS_SOURCES : Array<dbBonusSource> = [
    {
        name: "Add 2 Vigor, 2 Grit", //Index 0
        statBonuses: [
            {
                stat: StatTypeEnum.Vigor,
                quantity: 4,
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
        name: "Add 3 Tenacity", //Index 1
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 3,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Add 5 Tenacity", //Index 2
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 5,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Subtract 4 Tenacity", //Index 3
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: -4,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "Incrase Tenacity 50%", //Index 4
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 0.5,
                quantType: QuantTypeEnum.Increase
            }
        ]
    },
    {
        name: "Incrase Tenacity 200%", //Index 5
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 2,
                quantType: QuantTypeEnum.Increase
            }
        ]
    },
    {
        name: "Decrease Tenacity 75%", //Index 6
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: -0.75,
                quantType: QuantTypeEnum.Increase
            }
        ]
    },
    {
        name: "50% More Tenacity", //Index 7
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 0.5,
                quantType: QuantTypeEnum.More
            }
        ]
    },
    {
        name: "200% More Tenacity", //Index 8
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: 2,
                quantType: QuantTypeEnum.More
            }
        ]
    },
    {
        name: "75% Less Tenacity", //Index 9
        statBonuses: [
            {
                stat: StatTypeEnum.Tenacity,
                quantity: -0.75,
                quantType: QuantTypeEnum.More
            }
        ]
    },
    {
        name: "10% Further TEST_FURTHER", //Index 10
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_FURTHER,
                quantity: .1,
                quantType: QuantTypeEnum.Further
            }
        ]
    },
    {
        name: "30% Further TEST_FURTHER", //Index 11
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_FURTHER,
                quantity: .3,
                quantType: QuantTypeEnum.Further
            }
        ]
    },
    {
        name: "-80% Further TEST_FURTHER", //Index 12
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_FURTHER,
                quantity: -.8,
                quantType: QuantTypeEnum.Further
            }
        ]
    },
    {
        name: "120% Further TEST_FURTHER", //Index 13
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_FURTHER,
                quantity: 1.2,
                quantType: QuantTypeEnum.Further
            }
        ]
    },
    {
        name: "Add 10% TEST_FURTHER", //Index 14
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_FURTHER,
                quantity: .1,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "+10 TEST_POSITIVE_LINEAR", //Index 15
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_POSITIVE_LINEAR,
                quantity: 10,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "-5 TEST_POSITIVE_LINEAR", //Index 16
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_POSITIVE_LINEAR,
                quantity: -5,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "50% Increased TEST_POSITIVE_LINEAR", //Index 17
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_POSITIVE_LINEAR,
                quantity: .5,
                quantType: QuantTypeEnum.Increase
            }
        ]
    },
    {
        name: "80% More TEST_POSITIVE_LINEAR", //Index 18
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_POSITIVE_LINEAR,
                quantity: .8,
                quantType: QuantTypeEnum.More
            }
        ]
    },
    {
        name: "80% Further TEST_POSITIVE_LINEAR", //Index 19
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_POSITIVE_LINEAR,
                quantity: .8,
                quantType: QuantTypeEnum.Further
            }
        ]
    },
    {
        name: "+2 TEST_MIN_MAX_LINEAR", //Index 20
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_MIN_MAX_LINEAR,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "-4 TEST_MIN_MAX_LINEAR", //Index 21
        statBonuses: [
            {
                stat: StatTypeEnum.TEST_MIN_MAX_LINEAR,
                quantity: -4,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "+2 Agility, +2 Alacrity", //Index 22
        statBonuses: [
            {
                stat: StatTypeEnum.Agility,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Alacrity,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "+5 Agility, -2 Alacrity", //Index 23
        statBonuses: [
            {
                stat: StatTypeEnum.Agility,
                quantity: 5,
                quantType: QuantTypeEnum.Add
            },
            {
                stat: StatTypeEnum.Alacrity,
                quantity: -2,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "+2 Speed", //Index 24
        statBonuses: [
            {
                stat: StatTypeEnum.Speed,
                quantity: 2,
                quantType: QuantTypeEnum.Add
            }
        ]
    },
    {
        name: "+10% Fire Resistance", //Index 25
        statBonuses: [
            {
                stat: StatTypeEnum.Protection,
                quantity: .1,
                quantType: QuantTypeEnum.Add,
                damageType: { baseType: DamageBaseTypeEnum.Fire, superType: DamageSuperTypeEnum.All }
            }
        ]
    },
    {
        name: "+10% UNDEFINED Resistance", //Index 26
        statBonuses: [
            {
                stat: StatTypeEnum.Protection,
                quantity: .2,
                quantType: QuantTypeEnum.Add
            }
        ]
    }
]