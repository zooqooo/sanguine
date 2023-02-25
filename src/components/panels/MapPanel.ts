import Container from 'phaser3-rex-plugins/templates/ui/container/Container'

import { CST } from "../../_data/CST"
import HexCell, { Layout, Point } from '../../utils/HexCell'
import MapTile from '../game_components/MapTile'
import ExpolorationScene from '../../scenes/ExplorationScene'
import Button, { buttonStyle } from '../general_components/Button'

type mapPanelStyle = {
    x: number,
    y: number,
    radials: number
}

const flat : Layout = new Layout(Layout.flat, new Point(CST.SPRITE.HEXES.frameWidth/2, CST.SPRITE.HEXES.frameHeight/2 +1), new Point(0, 0))

const buttonStyle = {
    x: 0,
    y: 0,
    spriteKey: CST.SPRITE.HEXES.key,
    scale: 1,
    pixelPerfect: true
}

export default class MapPanel extends Container {
    readonly scene: ExpolorationScene
    private hexes!: Map<string, MapTile>
    private hexArray!: MapTile[]
    private locationMarker: Phaser.GameObjects.Image

    constructor(scene: ExpolorationScene, style: mapPanelStyle) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        const TOTAL_HEXES = 3 * style.radials * (style.radials - 1) + 1
        
        this.generateHexes(style.radials)
        this.renameHexes()

        this.locationMarker = this.scene.add.image(0, 0, CST.IMAGE.HEX_BORDER)

        scene.add.existing(this)
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    private generateHexes(radials: number) {
        let prototypeArray = this.initHexes(radials)
        this.hexes = new Map<string, MapTile>

        for (let s = radials; s >= -radials; s-- ) {
            for (let q = radials; q >= -radials; q-- ) {
                for (let r = -radials; r <= radials; r++ ) {
                    let triplePoint = `${q}${r}${s}`
                    if (!prototypeArray.has(triplePoint)) continue
                    let hex = prototypeArray.get(triplePoint)!
                    this.hexes.set(hex.getTriplePoint(), this.fillHex(hex))
                }
            }
        }
    }

    private initHexes(radials: number) {
        let prototypeArray = new Map<string, HexCell>
        for (let q = -radials; q <= radials; q++) {
            let r1 = Math.max(-radials, -q - radials)
            let r2 = Math.min( radials, -q + radials)
            for (let r = r1; r <= r2; r++) {
                prototypeArray.set(`${q}${r}${-q-r}`, new HexCell(q, r, -q-r))
            }
        }
        return prototypeArray
    }

    private fillHex(hex: HexCell) : MapTile {
        let coord = flat.hexToPixel(hex)
        buttonStyle.x = coord.x
        buttonStyle.y = coord.y

        let button = new MapTile(this.scene, buttonStyle, hex)
        this.add(button)
        return button
    }

    private renameHexes() {
        this.hexArray = []
        let middleHex = this.hexes.get('000')!.hex
        let ring = middleHex.cubeSpiral(3)

        ring.forEach(( element ) => {
            if (this.hexes.has(element.getTriplePoint())) {
                let hex = this.hexes.get(element.getTriplePoint())!
                this.hexArray.push(hex)
                //hex.setText(`${this.hexArray.length -1}`, { fontSize: '14px', textOffset: -2, dropShadow: false })
                hex.setIndex(this.hexArray.length -1)
            }
        })
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getHex(locationIndex: number) {
        return this.hexArray[locationIndex]
    }

    getHexes() : MapTile[] {
        return this.hexArray
    }

    getLocationMarker() : Phaser.GameObjects.Image {
        return this.locationMarker
    }

    /* -----------------------------
            SET GAME STATE
    ----------------------------- */

    addCallbackFunction(callback: Function) {
        this.hexArray.forEach( (e) => {
            e.setCallBack(callback, this.hexArray.indexOf(e))
        })
    }

    updateToolTips() {
        this.hexArray.forEach( (e) => {
            e.updateToolTips()
        })
    }
}