import Container from 'phaser3-rex-plugins/templates/ui/container/Container'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { CST } from '../../CST'
import UIScene from './UIScene'

const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export type multiLabelStyle = {
    baseText: { text: string, style: multiLabelTextStyle }[],
    shiftText: { text: string, style: multiLabelTextStyle }[],
    liveUpdate?: boolean    
    context?: any
}

export type multiLabelTextStyle = Phaser.Types.GameObjects.Text.TextStyle & {
    parse?: boolean,
    sameLine?: boolean,
    isImage?: boolean,
    imageSize?: number
}

export default class AbstractMultiLabel extends Phaser.GameObjects.Container {
    style: multiLabelStyle
    textArea : RexUIPlugin.FixWidthSizer
    label : RexUIPlugin.Label
    liveUpdate : boolean
    modifiedText! : boolean
    initialized : boolean
    context: any

    constructor(scene: UIScene, style: multiLabelStyle) {
        super(scene)
        this.scene = scene
        this.style = style
        this.liveUpdate = style.liveUpdate ?? false
        this.initialized = false
        this.context = style.context? style.context : this.scene

        this.label = scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0).setStrokeStyle(2, COLOR_LIGHT).setFillStyle(COLOR_DARK),
            text: scene.rexUI.add.fixWidthSizer({
                space: {
                    left: 3, right: 3, top: 3, bottom: 3,
                    item: 6, line: 8
                }
            }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        })

        this.textArea = ( this.label.getElement('text') as RexUIPlugin.FixWidthSizer )
        this.add(this.label)
    }

    layout() {
        this.label.layout()
    }

    update(modifierKey: boolean) {
        if ( !this.initialized ) {
            this.initialized = true
            this.modifiedText = !modifierKey
        }

        if ( modifierKey ) {
            if (!this.modifiedText || this.liveUpdate) {
                this.modifiedText = true
                this.updateText(this.style.shiftText)
            }
        } else {
            if (this.modifiedText || this.liveUpdate) {
                this.modifiedText = false
                this.updateText(this.style.baseText)
            }
        }
    }

    updateText(lines: { text: string, style: multiLabelTextStyle}[]) {
        this.textArea.clear(true)
        let currentLine: Phaser.GameObjects.Components.GetBounds[] = []
        let currentWidth = 0
        for ( let i = 0; i < lines.length; i++) {
            let item = this.parseText(lines[i].text, lines[i].style)
            this.textArea.add(item)
            currentLine.push(item)
            if (i < (lines.length - 1) && !lines[i+1].style.sameLine ) {
                this.textArea.addNewLine()
                currentLine = []
            }
            currentWidth = Math.max(currentWidth,this.getWidthofObjects(currentLine))
        }
        this.textArea.setMinWidth(currentWidth)
        this.layout()
    }

    parseText(text: string, style: multiLabelTextStyle) {
        if ( style.isImage ) {
            let imageSize = style.imageSize ?? 64
            let scale = imageSize / 64
            return this.scene.add.sprite(0, 0, CST.SPRITE.ICONS.key, text).setScale(scale)
        } else {
            let parsedText = ''
            if (style.parse) {
                parsedText = function(str: string){
                    return eval(str)
                }.call(this.context,text)
            } else {
                parsedText = text
            }
            return this.scene.add.text(0, 0, parsedText, style)
        }
    }

    private getWidthofObjects(items: Phaser.GameObjects.Components.GetBounds[]) {
        let width = 0
        items.forEach( (e) => {
            width += e.getBounds().width
        })
        return width + ( this.textArea.space.item * ( items.length + 1 ) )
    }
}