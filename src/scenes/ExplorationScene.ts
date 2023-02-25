import EventDispatcher from "../utils/EventDispatcher"
import UIScene from "../components/abstract_and_templates/UIScene"
import OutboundRequests from "../utils/OutboundRequests"
import Serializer from "../../server/Serializer"

import { CST } from "../_data/CST"
import { BLACKSTONE_PANEL, TABBED_CONTROLLER } from "../layouts/ExplorationLayout"

import TabbedBook from "../components/general_components/TabbedBook"
import MapPanel from "../components/panels/MapPanel"
import InventoryPanel from "../components/panels/InventoryPanel"
import LocationPanel from "../components/panels/LocationPanel"
import BountyPanel from "../components/panels/BountyPanel"

import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer"

import { transitCharacter, transitGame, transitItem, transitLocation } from "../../server/_types/TransitTypes"

const COLOR_PRIMARY = 0x4e342e
const COLOR_LIGHT = 0x7b5e57
const COLOR_DARK = 0x260e04

export default class ExpolorationScene extends UIScene {
    /* -----------------------------
            CLASS VARIABLES
    ----------------------------- */

    private sanguineGame!: OutboundRequests
    private moving!: boolean

    /* -----------------------------
          COMPONENT REFERENCES
    ----------------------------- */

    private curtain?: Phaser.GameObjects.GameObject

    private locationUI!: LocationPanel
    private mapUI!: MapPanel
    private inventoryUI!: InventoryPanel
    private bountyUI!: BountyPanel

    /* -----------------------------
             GAME STATE
    ----------------------------- */

    private character!: transitCharacter
    private location!: transitLocation
    private inventory!: transitItem[]
    private regionNames!: string[]

    /* -----------------------------
           MANDATORY METHODS
    ----------------------------- */

    constructor() {
        super({
            key: CST.SCENES.EXPLORATION
        })
    }
    
    init(data: any) {
        this.emitter = EventDispatcher.getInstance()
        this.modifierKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        let serializer = data as Serializer
        this.sanguineGame = new OutboundRequests(serializer)
        this.moving = false
    }

    preload() {
    }

    create() {
        this.curtain = this.add.rectangle(900, 450, 1800, 900, 0x000000).setDepth(1000).setInteractive()
        this.locationUI = new LocationPanel(this, {x: 1800, y: 0}).setDepth(-1)
        const tabbedController = this.createTabbedController().setDepth(0)
        const hud = this.add.image(900,450, CST.IMAGE.EXPLORATION_HUD).setDepth(0)
        const blackstonePanel = this.createBountyPanel(55, 665).setDepth(1)

        this.startGame()
    }

    update(time: number, delta: number) {
        this.currentToolTip?.update(this.modifierKey.isDown)
    }

    /* -----------------------------
            LAYOUT METHODS
    ----------------------------- */

    private createTabbedController(): TabbedBook {
        //@ts-ignore
        let tabPages = new TabbedBook(this, TABBED_CONTROLLER)

        tabPages.addPage('map', tabPages.createLabel(CST.SPRITE.MAIN_TABS.key, 0, 1), this.createMapTab())
        tabPages.addPage('inventory', tabPages.createLabel(CST.SPRITE.MAIN_TABS.key, 2, 3), this.createInventoryTab())
        tabPages.addPage('journal', tabPages.createLabel(CST.SPRITE.MAIN_TABS.key, 4, 5), this.createJournalTab())
        tabPages.addPage('character', tabPages.createLabel(CST.SPRITE.MAIN_TABS.key, 6, 7), this.createCharacterTab())

        return this.add.existing(tabPages.init())
    }

    private createMapTab(): Sizer {
        const mapContainer = this.rexUI.add.sizer(0, 0).addBackground(this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY))
        this.mapUI = new MapPanel(this, {x: 0, y: 0, radials: 1})
        return mapContainer.addMultiple([this.mapUI]).layout()
    }
    
    private createInventoryTab(): Sizer {
        const inventoryContainer = this.rexUI.add.sizer(0, 0).addBackground(this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY))
        this.inventoryUI = new InventoryPanel(this, {x: 0, y: 0})
        return inventoryContainer.addMultiple([this.inventoryUI]).layout()
    }

    private createJournalTab(): Sizer {
        const journalContainer = this.rexUI.add.sizer(0, 0).addBackground(this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY))
        const label = this.rexUI.add.label({
            width: 40, height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
            text: this.add.text(0, 0, 'Journal', { fontSize: '24px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        }).layout()
        return journalContainer.addMultiple([label]).layout()
    }

    private createCharacterTab(): Sizer {
        const characterContainer = this.rexUI.add.sizer(0, 0).addBackground(this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY))
        const label = this.rexUI.add.label({
            width: 40, height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
            text: this.add.text(0, 0, 'Character', { fontSize: '24px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        }).layout()
        return characterContainer.addMultiple([label]).layout()
    }

    private createBountyPanel(x: number, y: number): BountyPanel {
        this.bountyUI = new BountyPanel(this, {x: x, y: y}, BLACKSTONE_PANEL)
        return this.bountyUI        
    }

    private createRespawnPanel(): Phaser.GameObjects.Container {
        const container = this.add.container().setDepth(200)
        const background = this.add.rectangle(900, 450, 1800, 900, COLOR_DARK).setInteractive()
        const button = this.rexUI.add.label({
            x: 900,
            y: 450,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, COLOR_LIGHT),
            text: this.add.text(0, 0, 'Wow a button', {
                fontSize: '18px'
            }),
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                icon: 10
            },
            align: 'center'
        }).layout().setInteractive()

        button.on('pointerup', () => {
            this.endRespawn()
        })

        container.add([background, button])
        return container
    }

    /* -----------------------------
              GETTERS
    ----------------------------- */

    getLocation(): transitLocation { 
        return this.location
    }

    getLocationName(index: number): string {
        return this.regionNames[index]
    }

    /* -----------------------------
            INIT METHODS
    ----------------------------- */

    setGameState(gameState: transitGame) {
        console.log(gameState)
        this.location = gameState.location
        this.character = gameState.characterStatus
        this.inventory = gameState.inventory


        this.initLocationUI()
        this.initMapUI()
        this.initInventoryUI()
        //this.initJournalUI()
        //this.initCharacterUI()
        this.initBountyUI()
    }
    
    initUI(params: {gameState: transitGame, regionNames: string[]}) {
        this.regionNames = params.regionNames
        this.setGameState(params.gameState)

        if ( !this.character.initialized ) {
            this.sanguineGame.beginCharacterInitialize()
            this.endRespawn()
            // this.startRespawn()
            return
        }        
        this.curtain!.destroy(true)
    }

    initLocationUI() {
        this.locationUI.initBackground(this.location.background)
    }

    initMapUI() {
        this.mapUI.updateToolTips()
        this.mapUI.addCallbackFunction(this.requestMove)
        this.moveLocationMarker(this.location.index, 0)
    }

    initInventoryUI() {
        this.updateInventory(this.inventory)
    }

    //initJournalUI() { }

    //this.initCharacterUI() { }

    initBountyUI() {
        this.bountyUI.updateToolTips()
        this.bountyUI.setBounty(this.location.bounty)
    }

    /* -----------------------------
              REQUESTS
    ----------------------------- */

    async startGame() {
        const UIInfo = await this.sanguineGame.startGame()
        this.initUI(UIInfo)
    }

    async requestMove(targetIndex: number) {
        if ( !this.moving ) {
            const targetLocation = await this.sanguineGame.move(targetIndex)
            if (targetLocation == "Invalid Move") {
                console.log('Invalid Move')
                return
            }
            this.move(targetLocation)
        }
    }

    async requestGatherBounty(action: "Forage" | "Collect") {
        const bounty = await this.sanguineGame.gatherBounty(action)
        this.gatherBounty(bounty)
    }

    /* -----------------------------
            LOGIC METHODS
    ----------------------------- */

    /* ----    RESPAWN    ---- */

    async startRespawn() {
        this.input.topOnly = true
        const curtain = this.curtain!
        this.curtain = this.createRespawnPanel()
        curtain.destroy(true)

        let choices = await this.sanguineGame.beginCharacterInitialize()
    }
    
    async endRespawn() {
        const gameState = await this.sanguineGame.verifyCharacterInitialize( {classChoice: 0, weaponChoice: 0} )
        this.setGameState(gameState)
        this.curtain!.destroy(true)
    }

    /* ----     MOVE     ---- */

    move(targetLocation: transitLocation) {
        this.location = targetLocation
        this.moveLocationMarker(targetLocation.index, 180)
        this.locationUI.transitBackground(targetLocation.background)
        this.bountyUI.setBounty(targetLocation.bounty)
        this.bountyUI.updateToolTips()
    }

    moveLocationMarker(targetIndex: number, duration: number) {
        this.moving = true
        let tween = this.tweens.add({
            targets: [this.mapUI.getLocationMarker()],
            x: this.mapUI.getHex(targetIndex).x,
            y: this.mapUI.getHex(targetIndex).y,
            duration: duration,
            onComplete: () => { this.moving = false },
            completeDelay: duration+8
        })
    }

    /* ----  INVENTORY   ---- */

    updateInventory(inventory: transitItem[]) {
        this.inventory = inventory
        this.inventoryUI.fillGrid(this.inventory).layout()
    }

    /* ----   GATHER     ---- */

    gatherBounty(params: { drops: string, bounty: number, inventory: transitItem[] }) {
        this.updateInventory(params.inventory)
        this.locationUI.createToast(params.drops)
        this.location.bounty = params.bounty
        this.bountyUI.setBounty(this.location.bounty)
    }
}
