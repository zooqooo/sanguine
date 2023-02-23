export default class SpriteTab extends Phaser.GameObjects.Sprite {
    dullFrame : number
    activeFrame : number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, dullFrame: number, activeFrame: number) {
        super(scene, x, y, texture, dullFrame)
        
        this.dullFrame = dullFrame
        this.activeFrame = activeFrame
        
        return scene.add.existing(this)
    }

    makeActive() {
        this.setFrame(this.activeFrame)
    }

    makeDull() {
        this.setFrame(this.dullFrame)
    }
}