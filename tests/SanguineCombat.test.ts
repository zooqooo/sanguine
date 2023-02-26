import { describe, expect, it } from 'vitest'
import SanguineActor from '../server/Actor'
import CombatActor from '../server/combat/CombatActor'
import SanguineCombat from '../server/combat/SanguineCombat'
import { transitCombatActor, gameTick } from '../server/_types/CombatTypes'

describe('Create Combat', () => {
    it('Create Empty Combat', () => {
        const combat = new SanguineCombat()
        expect(combat.getCombatants()).to.deep.equal(new Map<string, CombatActor>())
    })

    it('Create a combat actor', () => {
        const actor1 = new SanguineActor({name: "Actor1"})

        const combatActor = new CombatActor("Actor1_1", actor1)
        expect(actor1.stats).to.deep.equal(combatActor.stats)
    })

    it('Add a combat actor', () => {
        const combat = new SanguineCombat()
        let testMap = new Map<string, CombatActor>()
        expect(combat.getCombatants()).to.deep.equal(testMap)

        const actor1 = new SanguineActor({name: "Actor1"})

        const combatActor = new CombatActor("Actor1_1", actor1)
        testMap.set(combatActor.getID(), combatActor)

        combat.addCombatant(actor1)

        expect(combat.getCombatants()).to.deep.equal(testMap)

        const actor2 = new SanguineActor({name: "Actor1"})

        const combatActor2 = new CombatActor("Actor1_2", actor2)
        testMap.set(combatActor2.getID(), combatActor2)

        combat.addCombatant(actor2)

        expect(combat.getCombatants()).to.deep.equal(testMap)
    })
})

describe('Begin Combat', () => {
    it('Make a game tick', () => {
        const actor1 = new SanguineActor({name: "Actor1"})
        const actor2 = new SanguineActor({name: "Actor2"})
        const combat = new SanguineCombat()
            .addCombatant(actor1)
            .addCombatant(actor2)

        const gameTick = combat.requestGameTick() as gameTick

        let combatants = combat.getCombatants()
        let testMap = new Map<string, transitCombatActor>()
        for ( const [id, actor] of combatants ) {
            testMap.set(id, actor.transit())
        }

        expect(gameTick.tick).to.deep.equal(0)
        expect(gameTick.actors).to.deep.equal(testMap)

        const gameTick2 = combat.requestGameTick() as gameTick

        expect(gameTick2.tick).to.deep.equal(1)
        expect(gameTick2.actors).to.deep.equal(testMap)
    })
})