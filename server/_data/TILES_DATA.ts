import { dbTile } from "../_types/DBTypes"


export const TILES : Array<dbTile> = [
    {
        index: 0,
        name: 'Major Pool',
        background: "Sanguine Pool",
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Gold Thorn", quantity: 1}, {id: "Thunder Thistle", quantity: 1}],
                chance: 3
            },
            {
                drops: [{id: "Wind Bloom", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 1,
        name: 'Meadow',
        background: 'Meadow',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Lava Root", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 2,
        name: 'Mesa',
        background: 'Mesa',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Blood Rose", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 3,
        name: 'Waterfall',
        background: 'Waterfall',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Obsidian Bark", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 4,
        name: 'Oasis',
        background: 'Oasis',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Uncommon Fern", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 5,
        name: 'Valley',
        background: 'Valley',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Tangle Weed", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    },
    {
        index: 6,
        name: 'Lake',
        background: 'Lake',
        allowForage: true,
        allowCollect: true,
        forageTable: [
            {
                drops: [{id: "Mud Nut", quantity: 3}],
                chance: 1
            }
        ],
        collectTable: [
            {
                drops: [{id: "Drift Seed", quantity: 2}],
                chance: 1
            }
        ]
    }
]