export const CST = {
    SCENES: {
        LOAD: "loading-screen",
        MENU: "main-menu",
        EXPLORATION: "exploration",
    },
    IMAGE: {
        LOGO: "Logo.png",
        MISSING_TEXTURE: "MissingTexture.png",
        LOADING: "Loading.png",
        MENU_BG: "MenuBackground.jpg",
        FINGER_PAINT: "FingerPaint.png",
        SLIDER_TRACK: "SliderTrack.png",
        SLIDER_THUMB: "SliderThumb.png",
        EXPLORATION_HUD: "ExplorationHud.png",
        TABBED_CONTROLLER: "TabbedController.png",
        BLACKSTONE_BACKGROUND: "BlackStone.png",
        HEX_BORDER: "HexBorder.png"
    },
    BACKGROUND: {
        SANGUINEPOOL: "SanguinePool.png",
        LAKE: "00103.png",
        WATERFALL: "00202.png",
        MEADOW: "00401.png",
        VALLEY: "00404.png",
        OASIS: "03009.png",
        MESA: "02702.png"
    },
    SPRITE: {
        ICONS: {
            key: "Icons.png",
            frameWidth: 64,
            frameHeight: 64
        },
        HEXES: {
            key: "Hexes.png",
            frameWidth: 64,
            frameHeight: 56
        },
        PAINT_BUTTON: {
            key: "PaintButton.png",
            frameWidth: 610,
            frameHeight: 130
        },
        WOODEN_BUTTON: {
            key: "WoodenButton.png",
            frameWidth: 420,
            frameHeight: 130
        },
        WOODEN_FRAME: {
            key: "WoodenFrame.png",
            frameWidth: 54,
            frameHeight: 54
        },
        MAIN_TABS: {
            key: "Tabs.png",
            frameWidth: 43,
            frameHeight: 150
        },
        BLACKSTONE_BORDER: {
            key: "BlackStoneBorder.png",
            frameWidth: 350,
            frameHeight: 54
        },
        FLOWER_ITEMS: {
            key: "flowers.png",
            frameWidth: 64,
            frameHeight: 64
        }
    },
    AUDIO: { 
        MENU_START: {
            key: "MenuStart.ogg",
            music: false,
            loop: false,
            volume: 0.4
        },
        MENU_BACK: {
            key: "MenuBack.ogg",
            music: false,
            loop: false,
            volume: 0.4
        },
        MENU_HOVER: {
            key: "MenuHover.ogg",
            music: false,
            loop: false,
            volume: 0.4
        }
    },
    TEXT: {
        LOGIN_FORM: "LoginForm.html"
    }
}

export const ICONS = {
    MAP: 0
}

export var sndManager: {MUSIC_VOLUME: number, SOUND_VOLUME: number} = {
    MUSIC_VOLUME: 0.7,
    SOUND_VOLUME: 0.7
}