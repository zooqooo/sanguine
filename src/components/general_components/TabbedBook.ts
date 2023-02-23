import Container from 'phaser3-rex-plugins/templates/ui/container/Container'
import TabPages from 'phaser3-rex-plugins/templates/ui/tabpages/TabPages'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import SpriteTab from './SpriteTab'
import UIScene from '../abstract_and_templates/UIScene'

type tabbedBookStyle = {
    x: number,
    y: number
    tabsStyle: TabPages.IConfig
}

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export default class TabbedBook extends Container {
    readonly scene: UIScene
    style: tabbedBookStyle
    tabPages: RexUIPlugin.TabPages

    constructor(scene: UIScene, style: tabbedBookStyle) {
        super(scene)
        this.scene = scene
        this.style = style
        this.x = style.x
        this.y = style.y

        this.tabPages = new TabPages(scene, style.tabsStyle).setOrigin(0,0)
            .on('tab.focus', function (tab : SpriteTab) { tab.makeActive() })
            .on('tab.blur', function (tab : SpriteTab) { tab.makeDull() })

        this.tabPages.addBackground(scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK))
        this.add(this.tabPages)
        scene.add.existing(this)
    }

    init() {
        this.layout()
        //this.tabPages.swapPage('inventory')
        this.tabPages.swapFirstPage()
        return this
    }

    layout() {
        this.tabPages.layout()
        return this
    }

    addPage(key: string, tab: SpriteTab, page: Phaser.GameObjects.GameObject) {
        this.tabPages.addPage(key, tab, page).layout()
        return this
    }

    createLabel(key: string, dullFrame: number, activeFrame: number) {
        return new SpriteTab(this.scene, 0, 0, key, dullFrame, activeFrame)
    }
}