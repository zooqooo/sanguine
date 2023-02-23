import { describe, expect, it } from 'vitest'
import Serializer, { serializedGame } from '../server/Serializer'
import { transitLocation } from '../server/_types/TransitTypes'
import OutboundRequests from '../src/utils/OutboundRequests'

const DUMMY_SAVE: serializedGame = {
    character: {
        name: 'Little Jim',
        location: 2,
        initialized: false
    },
    region: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
    ]
}

describe('The request object should be able to construct a game', () => {
    it('A serializer should be created from the dummy object', () => {
        let serializer = new Serializer(DUMMY_SAVE)
    })

    it('The request object should be able to instnatiate', () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
    })

    it('The request object should be able to start a game', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.regionNames[0]).to.deep.equal('Major Pool')
    })

    it('The request object should be able to recieve a game state', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()
        expect(gameState1.gameState.characterStatus.initialized).toBeFalsy
        expect(gameState1.gameState.location.name).to.deep.equal('Mesa')
    })
})

describe('Request to initilize character', () => {
    it('The request object should be able to initialize the character', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.gameState.characterStatus.initialized).toBeFalsy

        let choices = await sanguineGame.beginCharacterInitialize()

        expect(choices).to.deep.equal({ classChoices: ["Sanguine Hero", "Sanguine Explorer", "Sanguine Inquisitor"], weaponChoices: ["Hammer Anima", "Axe Anima", "Spear Anima"] })

        const gameState2 = await sanguineGame.verifyCharacterInitialize( {classChoice: 0, weaponChoice: 0} )

        expect(gameState2.characterStatus.initialized).toBeTruthy
        expect(gameState2.characterStatus.bonusSources).to.deep.equal(['Sanguine Hero', 'Hammer Anima'])
    })
})

describe('Request to move', () => {
    it('The request object should be able to delare an invalid move', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.gameState.location.name).to.deep.equal('Mesa')

        let targetLocation = await sanguineGame.move(6)

        expect(targetLocation).to.deep.equal("Invalid Move")      
    })

    it('The request object should be able to delare an valid move', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.gameState.location.name).to.deep.equal('Mesa')

        let targetLocation = await sanguineGame.move(0)

        expect((targetLocation as transitLocation).name).to.deep.equal("Major Pool")      
    })
})

describe('Request to gather', () => {
    it('The request object should be able to forage', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        const bounty = await sanguineGame.gatherBounty("Forage")

        expect(bounty.bounty).to.deep.equal(2)
    })

    it('The request object should be able to collect', async () => {
        let serializer = new Serializer(DUMMY_SAVE)
        let sanguineGame = new OutboundRequests(serializer)
        const gameState1 = await sanguineGame.startGame()

        const bounty = await sanguineGame.gatherBounty("Forage")

        expect(bounty.bounty).to.deep.equal(2)
    })
})
