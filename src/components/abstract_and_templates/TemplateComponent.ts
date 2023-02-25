import Container from 'phaser3-rex-plugins/templates/ui/container/Container'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { CST, sndManager } from "../../_data/CST"
import UIScene from './UIScene'

type templateStyle = {
    x: number,
    y: number
}

export default class TemplateComponent extends Container {
    readonly scene: UIScene

    constructor(scene: UIScene, style: templateStyle) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        const label = scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0).setStrokeStyle(2, 0x7b5e57),
            text: scene.add.text(0, 0, 'testing text', { fontSize: '18px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        }).layout()

        this.add(label)

        scene.add.existing(this)
    }
}