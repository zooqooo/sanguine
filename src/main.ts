import Phaser from 'phaser'
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js'
import EventPromisePlugin from 'phaser3-rex-plugins/plugins/eventpromise-plugin.js'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

import LoadingScreenScene from './scenes/LoadingScreenScene'
import MainMenuScene from './scenes/MainMenuScene'
import ExpolorationScene from './scenes/ExplorationScene'

const config = {
    type: Phaser.AUTO,
    parent: 'app',
    width: 1800,
    height: 900,
    // scale: {
    //     mode: Phaser.Scale.NONE,
    //     autoCenter: Phaser.Scale.NO_CENTER
    // },
    // autoRound: false,
    // canvas: null,
    // canvasStyle: null,

    scene: [
        LoadingScreenScene,
        MainMenuScene,
        ExpolorationScene
    ],

    // callbacks: {
    //     preBoot: NOOP,
    //     postBoot: NOOP
    // },

    // seed: [ (Date.now() * Math.random()).toString() ],

    title: 'Sanguine Wilds',

    // input: {
    //     keyboard: {
    //         target: window
    //     },
    //     mouse: {
    //         target: null,
    //         capture: true
    //     },
    //     activePointers: 1,
    //     touch: {
    //         target: null,
    //         capture: true
    //     },
    //     smoothFactor: 0,
    //     gamepad: false,
    //     windowEvents: true,
    // },
    disableContextMenu: true,

    backgroundColor: 0,

    render: {
        antialias: true,
        antialiasGL: true,
        desynchronized: false,
        pixelArt: false,
        roundPixels: false,
        transparent: false,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
        batchSize: 4096,
        maxLights: 10,
        maxTextures: -1,
        mipmapFilter: 'LINEAR', // 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR', 'LINEAR_MIPMAP_LINEAR'
        // pipeline:[]
    },

    // physics: {
    //     default: false  // no physics system enabled
    // },

    loader:{
        baseURL: '',
        path: '',
        enableParallel: true,
        maxParallelDownloads: 4,
        crossOrigin: undefined,
        responseType: '',
        async: true,
        user: '',
        password: '',
        timeout: 0,
        withCredentials: false,
        imageLoadType: 'XHR',    // 'HTMLImageElement' 
        localScheme: [ 'file://', 'capacitor://' ]
    },

    dom: {
        createContainer: true,
        behindCanvas: false,
    },

    plugins: {
        scene: [
        {
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        },
        // {
        //     key: 'rexTagTextPlugin',
        //     plugin: TagTextPlugin,
        //     start: true
        // },
        {
            key: 'rexEventPromise',
            plugin: EventPromisePlugin,
            start: true
        },
        {
            key: 'rexBoard',
            plugin: BoardPlugin,
            mapping: 'rexBoard'
        }]
    },

    // pipeline: { key:PipelineClass },

    // fps: {
    //     min: 10,
    //     target: 60,
    //     forceSetTimeOut: false,
    //     deltaHistory: 10
    // },

    // banner: {
    //     hidePhaser: false,
    //     text: '#ffffff',
    //     background: [
    //         '#ff0000',
    //         '#ffff00',
    //         '#00ff00',
    //         '#00ffff',
    //         '#000000'
    //     ]
    // }


}

export default new Phaser.Game(config)
