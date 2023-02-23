import { CST } from '../../CST'

import TransitionImage from 'phaser3-rex-plugins/plugins/transitionimage'
import Toast from "phaser3-rex-plugins/templates/ui/toast/Toast"

import ExpolorationScene from '../../scenes/ExplorationScene'

type locationPanelStyle = {
    x: number,
    y: number
}

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export default class LocationPanel extends Phaser.GameObjects.Container {
    readonly scene: ExpolorationScene
    private backgroundImage: TransitionImage
    private toast: Toast

    constructor(scene: ExpolorationScene, style: locationPanelStyle) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        this.backgroundImage = new TransitionImage(this.scene, 0, 0, CST.BACKGROUND.LOADING).setScale(3).setOrigin(1, 0)
        this.backgroundImage.setDuration(380)

        this.toast = this.scene.rexUI.add.toast({
            x: -576,
            y: 80,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY),
            text: this.scene.add.text(0, 0, '', {fontSize: '24px'}),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
        }).layout()
        
        this.add([this.backgroundImage, this.toast])

        scene.add.existing(this)
        //Phaser.Display.Align.In.TopRight(this, this.scene.alignerZone)
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    /* -----------------------------
                GETTERS
    ----------------------------- */

    /* -----------------------------
            SET GAME STATE
    ----------------------------- */

    initBackground(targetBackground: string) {
        this.backgroundImage.setDuration(0)
        this.backgroundImage.transit(targetBackground)
        this.backgroundImage.setDuration(380)
    }

    transitBackground(targetBackground: string) {
        this.backgroundImage.transit(targetBackground)
    }

    createToast(message: string) {
        console.log(message)
        this.toast.showMessage(message)
    }

}