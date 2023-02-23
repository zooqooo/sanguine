type frameStyle = {
    x: number,
    y: number,
    frameSprite: { key: string, frameWidth: number, frameHeight: number },
    width: number, 
    height: number,
    scale?: number
}

export default class Frame extends Phaser.GameObjects.Container {
    style: frameStyle

    constructor(scene: Phaser.Scene, style: frameStyle) {
        super(scene)
        this.scene = scene
        this.style = style
        this.x = style.x
        this.y = style.y

        if (style.width < 0 || style.height < 0) {
            throw new RangeError("The width and height of the frame must not be negative")
        }
        
        if (typeof style.scale == "undefined") {
            style.scale = 1
        }

        let currentBlock = null
        let spriteIndex = 0

        for (let h = 0; h < style.height; h++) {
            for (let w = 0; w < style.width; w++) {
                if ( h == 0) {
                    if ( w == 0 ) {
                        // top left corner
                        spriteIndex = 0
                    } else if ( w == style.width-1) {
                        // top right corner
                        spriteIndex = 2
                    } else {
                        // top edge
                        spriteIndex = 1
                    }
                } else if ( h == style.height-1) {
                    if ( w == 0 ) {
                        // bottom left corner
                        spriteIndex = 6
                    } else if ( w == style.width-1) {
                        // bottom right corner
                        spriteIndex = 8
                    } else {
                        // bottom edge
                        spriteIndex = 7
                    }
                } else {
                    if ( w == 0 ) {
                        // left edge
                        spriteIndex = 3
                    } else if ( w == style.width-1) {
                        // right edge
                        spriteIndex = 5
                    } else {
                        // middle
                        spriteIndex = 4
                    }
                }
                currentBlock = scene.add.sprite(style.x+((style.frameSprite.frameWidth*style.scale)*w), style.y+((style.frameSprite.frameHeight*style.scale)*h), style.frameSprite.key).setScale(style.scale).setFrame(spriteIndex)
                this.add(currentBlock)
            }
        }

        scene.add.existing(this);
    }

    offsetX() {
        let offset = (this.style.frameSprite.frameWidth * this.style.width)/2
        this.x = this.x - offset
        return this.x
    }

    offsetY() {
        let offset = (this.style.frameSprite.frameHeight * this.style.height)/2
        this.y = this.y - offset
        return this.y
    }

    offsetFrame() {
        this.offsetX()
        this.offsetY()
        return this
    }
}