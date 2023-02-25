import Toast from 'phaser3-rex-plugins/templates/ui/toast/Toast'
import { UIItem } from '../../utils/UITypes'
import UIScene from '../abstract_and_templates/UIScene'

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

const config = {
    x: 400,
    y: 300,
    //@ts-ignore
    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY),
    //@ts-ignore
    text: this.add.text(0, 0, '', {fontSize: '24px'}),
    space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
    },
}

export default class MyToast extends Toast {
    readonly scene: UIScene

    constructor(scene: UIScene) {
        super(scene, config)
        this.scene = scene

        this.addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY))
        //this.add = this.scene.add.text(0, 0, '', {fontSize: '24px'})
        
        scene.add.existing(this)
    }
    
    foundItems(items: UIItem[]) {
        items.forEach( (item) => {
            console.log(`toasting`)
            if ( item.quantity > 1 ) {
                this.showMessage(`Found ${item.quantity} ${item.name}s`)
            } else {
                this.showMessage(`Found ${item.quantity} ${item.name}`)
            }
        })
    }
}