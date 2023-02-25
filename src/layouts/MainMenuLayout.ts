import { CST } from '../_data/CST'

export const START = {
    START_BUTTON: { // startButton
        x: 280,
        y: 320,
        spriteKey: CST.SPRITE.PAINT_BUTTON.key,
        clickSound: CST.AUDIO.MENU_START,
        hoverSound: CST.AUDIO.MENU_HOVER,
        scale: 0.6,
        text: 'Start Game',
        textStyle: {
            fontSize: '40px',
            fontFamily: 'Nunito Sans',
            fontStyle: 'bold',
            textOffset: -10,
            dropShadow: true
        }
    },
    OPTIONS_BUTTON: {
        x: 280,
        y: 480,
        spriteKey: CST.SPRITE.PAINT_BUTTON.key,
        clickSound: CST.AUDIO.MENU_START,
        hoverSound: CST.AUDIO.MENU_HOVER,
        scale: 0.6,
        text: 'Options',
        textStyle: {
            fontSize: '40px',
            fontFamily: 'Nunito Sans',
            fontStyle: 'bold',
            textOffset: -10,
            dropShadow: true
        }
    }
}

export const OPTIONS = {
    BACK_BUTTON: {
        x: 1550,
        y: 820,
        spriteKey: CST.SPRITE.PAINT_BUTTON.key,
        clickSound: CST.AUDIO.MENU_BACK,
        hoverSound: CST.AUDIO.MENU_HOVER,
        scale: 0.6,
        text: 'Back',
        textStyle: {
            fontSize: '40px',
            fontFamily: 'Nunito Sans',
            fontStyle: 'bold',
            textOffset: -10,
            dropShadow: true
        }
    },
    OPTIONS_PANE: {
        x: 260,
        y: 330,
    },
    FRAME: { //frame
        x: 0,
        y: 0,
        frameSprite: CST.SPRITE.WOODEN_FRAME,
        width: 11,
        height: 4,
        scale: 1
    },
    MUSIC_SLIDER_TEXT: {
        x: 20,
        y: 15,
        text: 'Music Volume',
        textStyle: {
            fontSize: '24px',
            fontFamily: 'Nunito Sans'
        }
    },
    SOUND_SLIDER_TEXT: {
        x: 20,
        y: 115,
        text: 'Sound Volume',
        textStyle: {
            fontSize: '24px',
            fontFamily: 'Nunito Sans'
        }
    },
    MUSIC_SLIDER: {
        x: 350,
        y: 30,
        width: 280,
        height: 20,
        orientation: 'x',
        space: {
            top: 4,
            bottom: 4
        },
        input: 'drag', // 'drag'|'click'
    },
    SOUND_SLIDER: {
        x: 350,
        y: 130,
        width: 280,
        height: 20,
        orientation: 'x',
        space: {
            top: 4,
            bottom: 4
        },
        input: 'drag', // 'drag'|'click'
    }
}

export const LOGIN = {
    BACK_BUTTON: {
        x: 1550,
        y: 820,
        spriteKey: CST.SPRITE.PAINT_BUTTON.key,
        clickSound: CST.AUDIO.MENU_BACK,
        hoverSound: CST.AUDIO.MENU_HOVER,
        scale: 0.6,
        text: 'Back',
        textStyle: {
            fontSize: '40px',
            fontFamily: 'Nunito Sans',
            fontStyle: 'bold',
            textOffset: -10,
            dropShadow: true
        }
    },
    LOGIN_PANE: {
        x: 900,
        y: 450,
    }
}

export const CHARACTER_SELECT = {
    BACK_BUTTON: {
        x: 1550,
        y: 820,
        spriteKey: CST.SPRITE.PAINT_BUTTON.key,
        clickSound: CST.AUDIO.MENU_BACK,
        hoverSound: CST.AUDIO.MENU_HOVER,
        scale: 0.6,
        text: 'Back',
        textStyle: {
            fontSize: '40px',
            fontFamily: 'Nunito Sans',
            fontStyle: 'bold',
            textOffset: -10,
            dropShadow: true
        }
    },
    SELECT_PANEL: {
        x: 900,
        y: 450
    }
}