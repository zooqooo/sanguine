import { describe, expect, it } from 'vitest'
import CombatActor from '../server/combat/CombatActor'
import SanguineCombat from '../server/combat/SanguineCombat'

describe('Create Combat', () => {
    it('Create Empty Combat', () => {
        const combat = new SanguineCombat()
        expect(combat.getCombatants()).to.deep.equal(new Map<string, CombatActor>())
    })
})