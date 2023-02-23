import { sndManager } from "../../CST"
import UIScene from "../abstract_and_templates/UIScene"

export type buttonStyle = {
    x: number,
    y: number,
    spriteKey: string,
    clickSound?: { key: string, music: boolean, loop: boolean, volume: number },
    hoverSound?: { key: string, music: boolean, loop: boolean, volume: number },
    scale?: number,
    text?: string,
    textStyle?: buttonTextStyle
    pixelPerfect? : boolean
}

export type buttonTextStyle = Phaser.Types.GameObjects.Text.TextStyle & {
    textOffset?: number,
    dropShadow? : boolean,
}

export default class Button extends Phaser.GameObjects.Container {
    readonly scene: UIScene
    style: buttonStyle
    text? : Phaser.GameObjects.Text
    sprite: Phaser.GameObjects.Sprite
    callback: Function
    context: any

    constructor(scene: UIScene, style: buttonStyle, callback?: (arg0: any) => any, context?: any) {
        super(scene, style.x, style.y)
        this.scene = scene
        this.style = style
        callback ? this.callback = callback : this.callback = () => {}
        context ? this.context = context : undefined

        this.sprite = scene.add.sprite(0, 0, style.spriteKey).setFrame(0).setScale(style.scale? style.scale : 1)
        this.add(this.sprite)
        this.makeInteractive()
        
        scene.add.existing(this)
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    protected makeInteractive() {
        if (typeof this.style.pixelPerfect == "undefined") {
            this.sprite.setInteractive()
        } else {
            this.sprite.setInteractive(this.scene.input.makePixelPerfect())
        }

        if (typeof this.style.text !== "undefined") {
            let style = this.style.textStyle ? this.style.textStyle : {}
            this.setText(this.style.text, style)
        }
        
        this.sprite.on('pointerover', () => {
            this.sprite.setFrame(1)
            if (typeof this.style.hoverSound !== "undefined") this.playSound(this.style.hoverSound)
        })
        
        this.sprite.on('pointerout', () => {
            this.sprite.setFrame(0)
        })

        this.sprite.on('pointerdown', () => {
            this.sprite.setFrame(2)
        })

        this.sprite.on('pointerup', () => {
            this.sprite.setFrame(1)
            if (typeof this.style.clickSound !== "undefined") this.playSound(this.style.clickSound)
            this.callback.call(this.scene, this.context)
        })
    }

    /* -----------------------------
          GETTERS & SETTERS
    ----------------------------- */

    setText(text: string, style: buttonTextStyle) {
        this.text?.destroy()
        if (typeof style == 'undefined') {
            const buttonText = this.scene.add.text(0, 0, text)
            this.text = buttonText
            Phaser.Display.Align.In.Center(buttonText, this.sprite, 0)
            buttonText.setShadow(3, 3, '#000', 0, true)
            this.add(buttonText)
        } else {
            style.textOffset = style.textOffset? style.textOffset : 0
            style.dropShadow = style.dropShadow? style.dropShadow : false
            
            this.text = this.scene.add.text(0, 0, text, style)
            Phaser.Display.Align.In.Center(this.text, this.sprite, 0, style.textOffset)
            if ( style.dropShadow ) this.text.setShadow(3, 2, '#000', 0, false)
            this.add(this.text)
        }
    }

    setCallBack(callback: Function, context: any) {
        this.callback = callback
        this.context = context
        return this
    }

    /* -----------------------------
          UTILITY METHODS
    ----------------------------- */

    playSound(sound: { key: string, music: boolean, loop: boolean, volume: number }) {
        let volume = sound.volume * (sound.music ? sndManager.MUSIC_VOLUME : sndManager.SOUND_VOLUME)
        return this.scene.sound.play(sound.key, { volume: volume, loop: sound.loop })
    }
}