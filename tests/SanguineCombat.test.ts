import { describe, expect, it } from 'vitest'
import SanguineActor from '../server/Actor'
import CombatActor from '../server/combat/CombatActor'
import SanguineCombat from '../server/combat/SanguineCombat'

describe('Create Combat', () => {
    it('Create Empty Combat', () => {
        const combat = new SanguineCombat()
        expect(combat.getCombatants()).to.deep.equal(new Map<string, CombatActor>())
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
    })
})