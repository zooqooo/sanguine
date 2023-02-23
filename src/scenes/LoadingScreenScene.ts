import Phaser from 'phaser'
import { CST } from '../CST'
//@ts-ignore
import WebFontFile from '../utils/WebFontFile'

export default class LoadingScreenScene extends Phaser.Scene {
	constructor() {
		super({
            key: CST.SCENES.LOAD,
            pack: {
                files: [
                    {'type': 'image', 'key': 'Logo', 'url': 'images/Logo.png', 'extension': 'png'}
                ]
            }
        })
	}

    preload() {
        var logo = this.add.image(900, 300, 'Logo')
        
        var progressBar = this.add.graphics()
        var progressBox = this.add.graphics()
        progressBox.fillStyle(0x222222, 0.8)
        progressBox.fillRect(730, 650, 320, 50)

        //this.load.plugin('rexwaiteventsplugin', 'scripts/rexwaiteventsplugin.min.js', true)

        this.loadImages()
        this.loadBackgrounds()
        this.loadSprites()
        this.loadFonts()
        this.loadAudio()

        this.load.on('progress', function (value: number) {
            // console.log(value)
            progressBar.clear()
            progressBar.fillStyle(0xffffff, 1)
            progressBar.fillRect(740, 660, 300 * value, 30)
        })
                    
        this.load.on('fileprogress', function (file: { src: any }) {
            //console.log(file.src)
        })

        this.load.on('complete', function () {
            console.log('-- Loading Complete')
            progressBar.destroy()
            progressBox.destroy()
        })   
    }

    create() {
        this.add.text(770, 650, 'Click to start', { fontSize: '40px', fontFamily: 'Nunito Sans'})
        this.input.on('pointerup', ()=>{ this.scene.start(CST.SCENES.MENU)}, this)
    }

    loadImages() {
        console.log("-Load Images")
        this.load.setPath("images")

        for (let prop in CST.IMAGE) {
            //@ts-ignore
            this.load.image(CST.IMAGE[prop], CST.IMAGE[prop])
        }
    }

    loadBackgrounds () {
        console.log("-Load Backgrounds")
        this.load.setPath("backgrounds")

        for (let prop in CST.BACKGROUND) {
            //@ts-ignore
            this.load.image(CST.BACKGROUND[prop], CST.BACKGROUND[prop])
        }
    }

    loadSprites() {
        console.log("-Load Sprites")
        this.load.setPath("sprites")

        for (let prop in CST.SPRITE) {
            //@ts-ignore
            this.load.spritesheet(CST.SPRITE[prop].key, CST.SPRITE[prop].key, {
                //@ts-ignore
                frameHeight: CST.SPRITE[prop].frameHeight,
                //@ts-ignore
                frameWidth: CST.SPRITE[prop].frameWidth
            })
        }
    }

    loadFonts() {
        console.log("-Load Fonts")

        this.load.addFile(new WebFontFile(this.load, [
            'Press Start 2P',
            'Nunito Sans',
            'Roboto',
        ]))
    }

    loadAudio() {
        console.log("-Load Audio")
        this.load.setPath("audio")

        for (let prop in CST.AUDIO) {
            //@ts-ignore
            this.load.audio(CST.AUDIO[prop].key, CST.AUDIO[prop].key)
        }
    }
}
