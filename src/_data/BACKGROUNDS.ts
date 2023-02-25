import { CST } from "./CST"

export type UIImage = string

export type dbImage = {
    name: string,
    image: UIImage
}

export const BACKGROUNDS = [
    {
        name: "Sanguine Pool",
        image: CST.BACKGROUND.SANGUINEPOOL
    },
    {
        name: "Lake",
        image: CST.BACKGROUND.LAKE
    },
    {
        name: "Waterfall",
        image: CST.BACKGROUND.WATERFALL
    },
    {
        name: "Meadow",
        image: CST.BACKGROUND.MEADOW
    },
    {
        name: "Valley",
        image: CST.BACKGROUND.VALLEY
    },
    {
        name: "Oasis",
        image: CST.BACKGROUND.OASIS
    },
    {
        name: "Mesa",
        image: CST.BACKGROUND.MESA
    }
]