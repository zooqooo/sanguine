import Sizer from 'phaser3-rex-plugins/templates/ui/sizer/Sizer'
import { UIItem } from '../../scenes/ExplorationScene'
import UIScene from '../abstract_and_templates/UIScene'

type inventoryItemStyle = {
    x: number,
    y: number,
    item: UIItem
}

const COLOR_DARK = 0x260e04

export default class InventoryItem extends Sizer {
    readonly scene: UIScene
    item: UIItem

    constructor(scene: UIScene, style: inventoryItemStyle) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y
        this.item = style.item

        const label = this.scene.rexUI.add.holyGrail({
            x: 0, y: 0,
            width: 80, height: 70,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_DARK),    
            content: this.scene.add.sprite(
                0, 0,
                this.item.sprite.sheet.key,
                this.item.sprite.frame
            ).setScale(0.6),
            footer: this.scene.add.text(
                0, 0, this.item.name, { fontSize: '11px', wordWrap: { width: 80 } }
            ),
            rightSide: this.scene.add.text(
                0, 0, `${style.item.quantity}`, {
                color: 'yellow',
                align: 'right',
                backgroundColor: '#260e04',
                padding: { left: 3, right: 3, top: 3, bottom: 3 }
            }),
            expand: {
                footer: false,
                rightSide: false,
                content: false
            }
        }).layout()

        this.add(label)

        scene.add.existing(this.layout())
    }
}