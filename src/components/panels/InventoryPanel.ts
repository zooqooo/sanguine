import Container from 'phaser3-rex-plugins/templates/ui/container/Container'
import FixWidthSizer from 'phaser3-rex-plugins/templates/ui/fixwidthsizer/FixWidthSizer'
import { inventory, inventoryItem } from '../../Types'
import InventoryItem from '../game_components/InventoryItem'
import ExpolorationScene, { UIItem } from '../../scenes/ExplorationScene'
import { serializedItem } from '../../logic/Item'

type inventoryPanelStyle = {
    x: number,
    y: number
}

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export default class InventoryPanel extends Container {
    readonly scene: ExpolorationScene
    private sizer: FixWidthSizer

    constructor(scene: ExpolorationScene, style: inventoryPanelStyle) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        this.sizer = this.scene.rexUI.add.fixWidthSizer({ width: 440, space: {item: 8, line: 8, left: 4} })

        const panel = scene.rexUI.add.scrollablePanel({
            width: 300,
            height: 400,
            scrollMode: 0,
            panel: { child: this.sizer },
            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT)
            },
            space: { panel: 10 }
        }).layout()

        this.add(panel)

        scene.add.existing(this)
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    layout() {
        this.sizer.layout()
        return this
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    /* -----------------------------
            SET GAME STATE
    ----------------------------- */

    fillGrid(items: UIItem[]) {
        if ( typeof items.length == 'undefined' || items.length < 1 ) return this.sizer
        this.sizer.clear(true)
        items.forEach((item) => {            
            this.sizer.add(new InventoryItem(this.scene, {x: 0, y: 0, item: item}))
        })
        return this.sizer
    }
}