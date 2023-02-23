import ExpolorationScene from '../../scenes/ExplorationScene'
import { multiLabelTextStyle } from '../abstract_and_templates/AbstractMultiLabel'
import Button, { buttonStyle } from '../general_components/Button'
import ToolTip, { toolTipStyle } from '../general_components/ToolTip'

type bountyPanelStyle = {
    x: number,
    y: number
}

type bountyPanelConfig = {
    BACKGROUND: { imageKey: string },
    TRACKER: { spriteKey: string },
    FORAGE_BUTTON: buttonStyle,
    COLLECT_BUTTON: buttonStyle,
    HUNT_BUTTON: buttonStyle,
    CAMP_BUTTON: buttonStyle
}

export default class BountyPanel extends Phaser.GameObjects.Container {
    readonly scene: ExpolorationScene
    private bountyTracker: Phaser.GameObjects.Sprite

    constructor(scene: ExpolorationScene, style: bountyPanelStyle, CONFIG: bountyPanelConfig) {
        super(scene)
        this.scene = scene
        this.x = style.x
        this.y = style.y

        const background = this.scene.add.image(0,0,CONFIG.BACKGROUND.imageKey).setOrigin(0,0)
        this.bountyTracker = this.scene.add.sprite(0,0,CONFIG.TRACKER.spriteKey).setFrame(3).setOrigin(0,0)
        const forageButton = new Button(this.scene, CONFIG.FORAGE_BUTTON, this.scene.requestGatherBounty, 'Forage')
        const collectButton = new Button(this.scene, CONFIG.COLLECT_BUTTON, this.scene.requestGatherBounty, 'Collect')
        const huntButton = new Button(this.scene, CONFIG.HUNT_BUTTON, () => {undefined})
        const campButton = new Button(this.scene, CONFIG.CAMP_BUTTON, () => {undefined})
        
        this.add([background, this.bountyTracker, forageButton, collectButton, huntButton, campButton])

        scene.add.existing(this)
    }

    /* -----------------------------
          CONSTRUCTOR METHODS
    ----------------------------- */

    addTrackerToolTip() {
        this.bountyTracker.setInteractive()
        const TRACKER_TOOL_TIP: toolTipStyle = {
            baseText: this.getTrackerBaseToolTipString(),
            shiftText: this.getTrackerShiftToolTipString(),
            context: this,
            liveUpdate: true,
            delay: 180,
            fadeIn: 120,
            fadeOut: 20
        }

        this.removeToolTip(this.bountyTracker)
        this.bountyTracker.on('pointerover', () => { this.scene.currentToolTip = new ToolTip(this.scene, TRACKER_TOOL_TIP).setDepth(2).setAlpha(0).fadeIn() })
        this.bountyTracker.on('pointerout', () => { this.scene.currentToolTip = this.scene.currentToolTip?.fadeOut() })
    }

    removeToolTip(component: Phaser.GameObjects.GameObject) {
        component.off('pointerover')
        component.off('pointerout')
    }

    getTrackerBaseToolTipString() {
        let linesArray : { text: string, style: multiLabelTextStyle }[] = new Array<{ text: string, style: multiLabelTextStyle }>;
        let lineObject : { text: string, style: multiLabelTextStyle }

        lineObject = { 
            text: this.scene.getLocation().name,
            style: {fontFamily: 'Nunito Sans', fontSize: '30px', color: 'red' }
        }
        linesArray.push(lineObject)

        lineObject = {
            text: `Hold Shift for more information`,
            style: { fontFamily: 'Nunito Sans', fontSize: '12px'  }
        }
        linesArray.push(lineObject)

        return linesArray
    }

    getTrackerShiftToolTipString() {
        let linesArray : { text: string, style: multiLabelTextStyle }[] = new Array<{ text: string, style: multiLabelTextStyle }>;
        let lineObject : { text: string, style: multiLabelTextStyle }

        lineObject = { 
            text: this.scene.getLocation().name,
            style: {fontFamily: 'Nunito Sans', fontSize: '30px', color: 'red' }
        }
        linesArray.push(lineObject)

        lineObject = { 
            text: `Current Time`,
            style: { fontFamily: 'Nunito Sans', fontSize: '18px' }
        }
        linesArray.push(lineObject)

        lineObject = {
            text: "`${('0' + new Date().getMinutes()).slice(-2)}:${('0' + new Date().getSeconds()).slice(-2)}`",
            style: { fontFamily: 'Nunito Sans', fontSize: '18px', color: 'red', sameLine: true, parse: true }
        }
        linesArray.push(lineObject)

        return linesArray
    }
    
    /* -----------------------------
                GETTERS
    ----------------------------- */

    /* -----------------------------
            SET GAME STATE
    ----------------------------- */

    updateToolTips() {
        this.addTrackerToolTip()
    }
    
    setBounty(bounty: number) {
        this.bountyTracker.setFrame(bounty)
    }
}