import Container from 'phaser3-rex-plugins/templates/ui/container/Container'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { CST, sndManager } from "../../_data/CST"
import EventDispatcher from '../../utils/EventDispatcher'
import Button from './Button'
import Frame from './Frame'
import UIScene from '../abstract_and_templates/UIScene'

type selectorStyle = {
    x: number,
    y: number
}

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

const SCROLLABLE_PANEL = {
    x: 150,
    y: 162,
    height: 300,
    scrollMode: 'y',
    
    mouseWheelScroller: {
        focus: false,
        speed: 0.1
    },
    space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
        panel: 10,
    }
}

const OK_BUTTON = {
    x: 375,
    y: 55,
    scale: 0.38,
    spriteKey: CST.SPRITE.WOODEN_BUTTON.key,
    text: 'OK',
    textStyle: {
        fontStyle: 'bold',
        fontFamily: 'Nunito Sans',
        fontSize: '28px'
    },
    textOffset: -3
}

export default class ItemSelector extends Phaser.GameObjects.Container {
    currentlySelected?: RexUIPlugin.Label

    constructor(scene: UIScene, style: selectorStyle, items: string[], callback: () => any) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        const frame = new Frame(scene, {x: 0, y: 0, width: 10, height: 7, frameSprite: CST.SPRITE.WOODEN_FRAME}).offsetFrame()

        const okButton = new Button(scene, OK_BUTTON, callback)

        const PanelConfig1 = {
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),
            panel: {
                child: scene.rexUI.add.sizer({ width: 200, orientation: 'y'}),
                mask: { padding: 1 },
            },
            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 4, COLOR_DARK),
                thumb: scene.add.image(0, 0, CST.IMAGE.SLIDER_THUMB).setScale(0.37),
            }
        }

        let i = 0
        items.forEach( (e) => {
            PanelConfig1.panel.child.add(this.createLabel(scene, e, i), { expand: true })
            i++
        })

        //@ts-ignore
        var scrollablePanel = scene.rexUI.add.scrollablePanel({...SCROLLABLE_PANEL,...PanelConfig1}).layout()
        
        scrollablePanel.setChildrenInteractive({
            //@ts-ignore
            down: false, up: false, over: false, press: false, tap: false, swipe: false, inputEventPrefix: 'child.',
            click: {mode: 'release', clickInterval: 100},
        })

        scrollablePanel.on('child.click', (child : RexUIPlugin.Label) => {
            if (typeof this.currentlySelected !== 'undefined') {
                (this.currentlySelected.getElement('background')! as RexUIPlugin.RoundRectangle).setFillStyle()
            }
            this.currentlySelected = child;
            (child.getElement('background')! as RexUIPlugin.RoundRectangle).setFillStyle(COLOR_DARK)
        })

        frame.add([scrollablePanel, okButton])

        this.add([frame])

        scene.add.existing(this)
    }

    getCurrentlySelected() {
        if (typeof this.currentlySelected !== 'undefined') {
            return (this.currentlySelected!.getElement('text') as Phaser.GameObjects.Text).text
        }
        return null
    }

    getCurrentlySelectedIndex() {
        if (typeof this.currentlySelected !== 'undefined') {
            return parseInt(this.currentlySelected!.name)
        }
        return null
    }

    createLabel(scene: UIScene, text: string, index: number) {
        return scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0).setStrokeStyle(2, COLOR_LIGHT),
            text: scene.add.text(0, 0, text, { fontSize: '18px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            name: `${index}`
        })
    }

    playSound(sound: { key: string, music: boolean, loop: boolean, volume: number }) {
        let volume = sound.volume * (sound.music ? sndManager.MUSIC_VOLUME : sndManager.SOUND_VOLUME)
        return this.scene.sound.play(sound.key, { volume: volume, loop: sound.loop })
    }
}