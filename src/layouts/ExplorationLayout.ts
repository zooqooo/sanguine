import { buttonStyle } from '../components/general_components/Button'
import { CST, ICONS } from '../CST'

export const TABBED_CONTROLLER = {
    x: 0,
    y: 0,
    tabsStyle: {
        x: 0,
        y: 0,
        width: 645,
        height: 645,
        tabPosition: 'left',
        tabs: { space: { item: 0 } },
        align: { tabs: 'center' },
        space: { left: 0, right: 6, top: 2, bottom: 3, item: 0 }
    }
}

const BOUNTY_BACKGROUND: { imageKey: string } = {
    imageKey: CST.IMAGE.BLACKSTONE_BACKGROUND
}

const BOUNTY_TRACKER: { spriteKey: string } = {
    spriteKey: CST.SPRITE.BLACKSTONE_BORDER.key
}

const BOUNTY_FORAGE_BUTTON: buttonStyle = {
    x: 90,
    y: 85,
    scale: 0.38,
    spriteKey: CST.SPRITE.WOODEN_BUTTON.key,
    text: 'Forage',
    textStyle: {
        fontStyle: 'bold',
        fontFamily: 'Nunito Sans',
        fontSize: '28px',
        textOffset: -3,
        dropShadow: true
    }
}

const BOUNTY_COLLECT_BUTTON: buttonStyle = {
    x: 90+168+2,
    y: 85,
    scale: 0.38,
    spriteKey: CST.SPRITE.WOODEN_BUTTON.key,
    text: 'Collect',
    textStyle: {
        fontStyle: 'bold',
        fontFamily: 'Nunito Sans',
        fontSize: '28px',
        textOffset: -3,
        dropShadow: true
    }
}

const BOUNTY_HUNT_BUTTON: buttonStyle = {
    x: 90,
    y: 85+54+2,
    scale: 0.38,
    spriteKey: CST.SPRITE.WOODEN_BUTTON.key,
    text: 'Hunt',
    textStyle: {
        fontStyle: 'bold',
        fontFamily: 'Nunito Sans',
        fontSize: '28px',
        textOffset: -3,
        dropShadow: true
    }
}

const BOUNTY_CAMP_BUTTON: buttonStyle = {
    x: 90+168+2,
    y: 85+54+2,
    scale: 0.38,
    spriteKey: CST.SPRITE.WOODEN_BUTTON.key,
    text: 'Camp',
    textStyle: {
        fontStyle: 'bold',
        fontFamily: 'Nunito Sans',
        fontSize: '28px',
        textOffset: -3,
        dropShadow: true
    }
}

export const BLACKSTONE_PANEL = {
    BACKGROUND: BOUNTY_BACKGROUND,
    TRACKER: BOUNTY_TRACKER,
    FORAGE_BUTTON: BOUNTY_FORAGE_BUTTON,
    COLLECT_BUTTON: BOUNTY_COLLECT_BUTTON,
    HUNT_BUTTON: BOUNTY_HUNT_BUTTON,
    CAMP_BUTTON: BOUNTY_CAMP_BUTTON
}