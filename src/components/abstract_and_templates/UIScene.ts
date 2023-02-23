import EventDispatcher from "../../utils/EventDispatcher"
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import ToolTip from "../general_components/ToolTip"
import { Input } from "phaser"
import { sndManager } from "../../CST"


export default class UIScene extends Phaser.Scene {

    emitter!: EventDispatcher
    rexUI!: RexUIPlugin
    currentToolTip?: ToolTip
    modifierKey!: Input.Keyboard.Key

    constructor(params: {key: string}) {
        super(params)
    }

    playSound(sound: { key: string, music: boolean, loop: boolean, volume: number }) {
        let volume = sound.volume * (sound.music ? sndManager.MUSIC_VOLUME : sndManager.SOUND_VOLUME)
        return this.sound.play(sound.key, { volume: volume, loop: sound.loop })
    }
}