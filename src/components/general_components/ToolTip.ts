import AbstractMultiLabel, { multiLabelStyle } from '../abstract_and_templates/AbstractMultiLabel'
import UIScene from '../abstract_and_templates/UIScene'

const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export type toolTipStyle = multiLabelStyle & {
    delay: number,
    fadeIn: number,
    fadeOut: number
}

export default class ToolTip extends AbstractMultiLabel {
    style : toolTipStyle

    constructor(scene: UIScene, style: toolTipStyle) {
        super(scene, style)
        this.style = style
        scene.add.existing(this)
    }

    followMouse() {
        let x = this.scene.game.input.mousePointer.x + ( this.getBounds().width  / 2 ) + 3
        let y = this.scene.game.input.mousePointer.y - ( this.getBounds().height / 2 ) - 3
        this.setPosition(x, y) 
    }

    fadeIn() {
        this.scene.tweens.add({
            targets: [this],
            alpha: {from:0, to:1},
            repeat: 0,
            ease: 'Quad.easeIn',
            delay: this.style.delay,
            duration: this.style.fadeIn
        })
        return this
    }

    fadeOut() {
        this.scene.tweens.add({
            targets: [this],
            alpha: 0,
            repeat: 0,
            ease: 'Quad.easeIn',
            delay: 0,
            duration: this.style.fadeOut,
            onComplete: () => {
                this.destroy()
            }
        })
        return undefined
    }

    update(modifierKey: boolean) {
        super.update(modifierKey)               
        this.followMouse() 
    }
}