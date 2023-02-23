import { CST } from "../../CST"
import ExpolorationScene from '../../scenes/ExplorationScene'
import HexCell, { Layout, Point } from '../../utils/HexCell'
import Button, { buttonStyle } from '../general_components/Button'
import ToolTip, { toolTipStyle } from "../general_components/ToolTip"
import UIScene from '../abstract_and_templates/UIScene'

export default class MapTile extends Button {
    index!: number
    hex: HexCell
    
    constructor(scene: UIScene, style: buttonStyle, hex: HexCell, callback?: (arg0: any) => any, context?: any) {
        super(scene, style, callback, context)
        this.hex = hex
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    addToolTip() {
        this.sprite.setInteractive()
        const TILE_TOOL_TIP: toolTipStyle = {
            baseText: this.getBaseToolTipString(),
            shiftText: this.getShiftToolTipString(),
            context: this,
            liveUpdate: false,
            delay: 180,
            fadeIn: 120,
            fadeOut: 20
        }

        this.removeToolTip(this.sprite)
        
        this.sprite.on('pointerover', () => {
            this.sprite.setFrame(1)
            if (typeof this.style.hoverSound !== "undefined") this.playSound(this.style.hoverSound)
            this.scene.currentToolTip = new ToolTip(this.scene, TILE_TOOL_TIP).setDepth(2).setAlpha(0).fadeIn()
        })

        this.sprite.on('pointerout', () => {
            this.sprite.setFrame(0)
            this.scene.currentToolTip = this.scene.currentToolTip?.fadeOut()
        })
    }

    removeToolTip(component: Phaser.GameObjects.GameObject) {
        component.off('pointerover')
        component.off('pointerout')
    }

    /* -----------------------------
          GETTERS & SETTERS
    ----------------------------- */

    getLocationPixel() {
        var flat : Layout = new Layout(Layout.flat, new Point(CST.SPRITE.HEXES.frameWidth/2, CST.SPRITE.HEXES.frameHeight/2 +1), new Point(0, 0))
        return flat.hexToPixel(this.hex)        
    }

    setIndex(index: number) {
        this.index = index
        return this
    }

    updateToolTips() {
        this.addToolTip()
    }

    getBaseToolTipString() {
        let scene = this.scene as ExpolorationScene
        let text = scene.getLocationName(this.index)
        let style = {fontFamily: 'Nunito Sans', fontSize: '18px', color: 'white' }
        let linesArray = []
        let lineObject = { text: text, style: style }
        linesArray.push(lineObject)

        return linesArray
    }

    getShiftToolTipString() {
        let scene = this.scene as ExpolorationScene
        let text = scene.getLocationName(this.index)
        let style = {fontFamily: 'Nunito Sans', fontSize: '18px', color: 'white' }
        let linesArray = []
        let lineObject = { text: text, style: style }
        linesArray.push(lineObject)

        return linesArray
    }

    /* -----------------------------
          LOGIC METHODS
    ----------------------------- */

    isAdjacent(target: MapTile) {
        return this.hex.distance(target.hex) == 1
    }   
}