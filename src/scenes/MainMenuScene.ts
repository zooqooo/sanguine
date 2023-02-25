import Phaser from 'phaser'
import Button from '../components/general_components/Button'
import Frame from '../components/general_components/Frame'
import ItemSelector from '../components/general_components/ItemSelector'
import EventDispatcher from '../utils/EventDispatcher'
import { CST, sndManager } from '../_data/CST'
import { START, OPTIONS, LOGIN, CHARACTER_SELECT } from '../layouts/MainMenuLayout'

import UIScene from '../components/abstract_and_templates/UIScene'
import OutboundRequests from '../utils/OutboundRequests'

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export default class MainMenuScene extends UIScene {
    currentGroup: Phaser.GameObjects.Group = new Phaser.GameObjects.Group(this)

    constructor() {
        super({
            key: CST.SCENES.MENU
        })

        this.emitter = EventDispatcher.getInstance()
    }

    preload() {
        this.loadTestGame()
    }

    create() {
        console.log("Menu")
        this.add.image(0, 0, CST.IMAGE.MENU_BG).setOrigin(0).setDepth(-1)

        this.currentGroup = this.createStart()

    }

     createStart() {
        this.currentGroup.clear(true, true)

        const logo = this.add.image(1450, 200, CST.IMAGE.LOGO)
        const optionsButton = new Button(this, START.OPTIONS_BUTTON, () => { this.currentGroup = this.createOptions() })
        
        const startButton = new Button(this, START.START_BUTTON, () => { this.getCharactersFromPassword('test') })
        //const startButton = new Button(this, START.START_BUTTON, this.loadTestGame)

        return new Phaser.GameObjects.Group(this, [logo, startButton, optionsButton])
    }

    createOptions() {
        this.currentGroup.clear(true, true)

        const logo = this.add.image(1450, 200, CST.IMAGE.LOGO)
        const backButton = new Button(this, OPTIONS.BACK_BUTTON, () => { this.currentGroup = this.createStart() })

        const frame = new Frame(this, OPTIONS.FRAME)

        const musicSliderText = this.add.text(OPTIONS.MUSIC_SLIDER_TEXT.x, OPTIONS.MUSIC_SLIDER_TEXT.y, OPTIONS.MUSIC_SLIDER_TEXT.text, OPTIONS.MUSIC_SLIDER_TEXT.textStyle)
        const soundSliderText = this.add.text(OPTIONS.SOUND_SLIDER_TEXT.x, OPTIONS.SOUND_SLIDER_TEXT.y, OPTIONS.SOUND_SLIDER_TEXT.text, OPTIONS.SOUND_SLIDER_TEXT.textStyle)

        const sliderConfig1 = {
            value: sndManager.MUSIC_VOLUME,
            track: this.add.image(0, 0, CST.IMAGE.SLIDER_TRACK),
            thumb: this.add.image(0, 0, CST.IMAGE.SLIDER_THUMB).setScale(0.37),
            valuechangeCallback: function (value: number) { sndManager.MUSIC_VOLUME = value },
        }
        //@ts-ignore
        const musicSlider = this.rexUI.add.slider({...OPTIONS.MUSIC_SLIDER,...sliderConfig1}).layout()

        const sliderConfig2 = {
            value: sndManager.SOUND_VOLUME,
            track: this.add.image(0, 0, CST.IMAGE.SLIDER_TRACK),
            thumb: this.add.image(0, 0, CST.IMAGE.SLIDER_THUMB).setScale(0.37),
            valuechangeCallback: function (value: number) { sndManager.SOUND_VOLUME = value },
        }
        //@ts-ignore
        const soundSlider = this.rexUI.add.slider({...OPTIONS.SOUND_SLIDER,...sliderConfig2}).layout()

        const optionsPanel = this.add.container(OPTIONS.OPTIONS_PANE.x, OPTIONS.OPTIONS_PANE.y, [frame, musicSliderText, soundSliderText, musicSlider, soundSlider])

        return new Phaser.GameObjects.Group(this, [logo, backButton, optionsPanel])
    }

    async getCharactersFromPassword(password: string) {
        const player = await OutboundRequests.getCharactersFromPassword(password)

        if (player == "Invalid Password") {
            this.currentGroup =  this.createStart()
        } else {
            this.currentGroup =  this.createCharacterSelect(password, player)
        }
    }

    createCharacterSelect(password: string, player: { name: string, characterNames: string[] }) {
        this.currentGroup.clear(true, true)
        this.input.topOnly = false
        
        const selectPanel = new ItemSelector(this, CHARACTER_SELECT.SELECT_PANEL, player.characterNames, () => {
            if (selectPanel.getCurrentlySelected() == null) return
            let selectedChar = player.characterNames[selectPanel.getCurrentlySelectedIndex()!]
            this.selectCharacter(password, selectedChar)
        })

        return new Phaser.GameObjects.Group(this, [selectPanel])
    }


    async selectCharacter(password: string, characterName: string) {
        const outboundRequests = await OutboundRequests.getCharacterFromPassword(password, characterName)
        if (outboundRequests == "Invalid Password") {
            this.currentGroup =  this.createStart()
        } else if (outboundRequests == "Invalid Character") {
            this.currentGroup =  this.createStart()
        } else {
            this.scene.start(CST.SCENES.EXPLORATION, {outboundRequests: outboundRequests})
        }
    }

    async loadTestGame() {
        const outboundRequests = await OutboundRequests.createTestGame()
        this.scene.start(CST.SCENES.EXPLORATION, {outboundRequests: outboundRequests})
    }
}