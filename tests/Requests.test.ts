import { describe, expect, it } from 'vitest'
import { transitLocation } from '../server/_types/TransitTypes'
import OutboundRequests from '../src/utils/OutboundRequests'

describe('The request object should be able to construct a game', () => {
    it('The request object should be able to start a game', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.regionNames[0]).to.deep.equal('Major Pool')
    })

    it('The request object should be able to recieve a game state', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()
        expect(gameState1.gameState.characterStatus.initialized).toBeFalsy
        expect(gameState1.gameState.location.name).to.deep.equal('Major Pool')
    })
})

describe('Request to initilize character', () => {
    it('The request object should be able to initialize the character', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
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
    it('The request object should be able to delare an valid move', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()

        expect(gameState1.gameState.location.name).to.deep.equal('Major Pool')

        let targetLocation1 = await sanguineGame.move(2) as transitLocation
        expect(targetLocation1.name).to.deep.equal('Mesa')    
    })

    it('The request object should be able to delare an invalid move', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()
        
        let targetLocation1 = await sanguineGame.move(2) as transitLocation
        expect(targetLocation1.name).to.deep.equal('Mesa')
        
        let targetLocation2 = await sanguineGame.move(6) as "Invalid Move"
        expect(targetLocation2).to.deep.equal("Invalid Move")      
    })
})

describe('Request to gather', () => {
    it('The request object should be able to forage', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()

        const bounty = await sanguineGame.gatherBounty("Forage")

        expect(bounty.bounty).to.deep.equal(2)
    })

    it('The request object should be able to collect', async () => {
        const sanguineGame = await OutboundRequests.createTestGame()
        const gameState1 = await sanguineGame.startGame()

        const bounty = await sanguineGame.gatherBounty("Forage")

        expect(bounty.bounty).to.deep.equal(2)
    })
})
