import { BACKGROUNDS, UIImage } from "../_data/BACKGROUNDS"
import { CST } from "../_data/CST"
import { SPRITE_SHEETS, dbSprite, UISprite } from "../_data/SPRITE_SHEETS"

let instance: SpriteManager

export default class SpriteManager {
    private sprites: Map<string, UISprite>
    private backgrounds: Map<string, UIImage>

    constructor() {
        this.sprites = new Map<string, UISprite>()
        for (const item_type of SPRITE_SHEETS) {
            for ( const sprite of item_type ) {
                if (this.sprites.has(sprite.name)) throw new Error(`Index intersection in SPRITE_SHEETS data object, index ${sprite.name}`)
                this.sprites.set(sprite.name, sprite.sprite)
            }
        }
        
        this.backgrounds = new Map<string, UIImage>()
        for (const background of BACKGROUNDS) {
            if (this.backgrounds.has(background.name)) throw new Error(`Index intersection in BACKGROUNDS data object, index ${background.name}`)
            this.backgrounds.set(background.name, background.image)
        }
    }

    static getInstance(): SpriteManager {
        if (typeof instance == "undefined") {
            instance = new SpriteManager()
        }
        return instance
    }

    getSprite(name: string): UISprite {
        if ( !this.sprites.has(name) ) {
            return {
                sheet: {
                    key: CST.IMAGE.MISSING_TEXTURE,
                    frameWidth: 500,
                    frameHeight: 500
                },
                frame: 0
            }
        }
        return this.sprites.get(name)!
    }

    getBackground(name: string): UIImage {
        console.log(`searching for location background ${name}`)
        if ( !this.backgrounds.has(name) ) {
            console.log(`failed`)
            return CST.IMAGE.LOADING
        }
        console.log(`found`)
        return this.backgrounds.get(name)!
    }
}