import { describe, expect, it } from 'vitest'
import ActorStat from '../server/actor_stats/ActorStat'
import ActorStats from '../server/actor_stats/ActorStats'
import BonusSource from '../server/actor_stats/BonusSource'
import { DamageBaseTypeEnum, DamageSuperTypeEnum, ElementalTypeEnum, StatTypeEnum } from '../server/_types/StatTypes'
import { MOCK_BONUS_SOURCES } from './testdata/MockBonusSources'

describe('ActorStats getters', () => {
    it('getStatNames', () => {
        let stats = new ActorStats([StatTypeEnum.Vigor, StatTypeEnum.Grit])
        expect(stats.getStatNames()).to.deep.equal(['Vigor', 'Grit'])

        stats = new ActorStats()
        expect(() => stats.getStatNames()).not.toThrowError()
    })

    it('getStatValues', () => {
        let stats = new ActorStats([StatTypeEnum.Vigor, StatTypeEnum.Grit])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[0])) //Add 4 Vigor, 2 Grit
        let values = new Map<string, number>()
        values.set('Vigor', 4)
        values.set('Grit', 2)
        expect(stats.getStatValues()).to.deep.equal(values)

        stats = new ActorStats()
        expect(() => stats.getStatValues()).not.toThrowError()
    })

    it('getStat', () => {
        let stats = new ActorStats([StatTypeEnum.Vigor, StatTypeEnum.Grit])
        let testStat = new ActorStat(stats, StatTypeEnum.Vigor)
        expect(stats.getStat(StatTypeEnum.Vigor)).to.deep.equal(testStat)
    })

    it('getStatQuant', () => {
        let stats = new ActorStats([StatTypeEnum.Vigor, StatTypeEnum.Grit])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[0])) //Add 4 Vigor, 2 Grit
        expect(stats.getStatValue(StatTypeEnum.Vigor)).to.deep.equal(4)
    })

    it('getStatQuant (with damage type)', () => {
        let stats = new ActorStats([StatTypeEnum.Protection])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[25])) //+10% Fire Protection
        expect(stats.getStatValue(StatTypeEnum.Protection, { baseType: DamageBaseTypeEnum.Fire, superType: DamageSuperTypeEnum.Stamina })).to.deep.equal(.1)
    })

    it('getStatQuant (without damage type)', () => {
        let stats = new ActorStats([StatTypeEnum.Protection])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[25])) //+10% Fire Protection
        expect(() => stats.getStatValue(StatTypeEnum.Protection)).toThrowError('is damage typed')
    })

    it('getSources', () => {
        let stats = new ActorStats([StatTypeEnum.Vigor, StatTypeEnum.Grit])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[0])) //Add 4 Vigor, 2 Grit
        let values = new Map<string, BonusSource>()
        let testSource = new BonusSource(MOCK_BONUS_SOURCES[0])
        values.set(testSource.getID(), testSource)
        expect(stats.getSources()).to.deep.equal(values)
    })
})

describe('Bonuses should be applied according to the rules', () => {
    it('Add quant type should add values', () => {
        let stats = new ActorStats([StatTypeEnum.Tenacity])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[1])) // Add 3 Tenacity
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(3)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[2])) // Add 5 Tenacity
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(8)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[3])) // Subtract 4 Tenacity
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(4)
    })

    it('Increase quant type should multiply values with additive stacking', () => {
        let stats = new ActorStats([StatTypeEnum.Tenacity])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[1])) // Add 3 Tenacity
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(3)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[4])) // Increase Tenacity 50%
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(4.5)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[5])) // Increase Tenacity 200%
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(10.5)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[6])) // Decrease Tenacity 75% 
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(8.25)
    })

    it('More quant type should multiply values with multiplicitive stacking', () => {
        let stats = new ActorStats([StatTypeEnum.Tenacity])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[1]))
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(3)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[7])) // 50% more Tenacity 
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(4.5)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[8])) // 200% more Tenacity 
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(13.5)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[9])) // 75% less Tenacity 
        expect(stats.getStatValue(StatTypeEnum.Tenacity)).to.deep.equal(3.375)
    })

    it('Further quant type should geometrically combine values', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_FURTHER])
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[10])) // 10% Further TEST_FURTHER
        expect(stats.getStatValue(StatTypeEnum.TEST_FURTHER)).toBeCloseTo(.1,4)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[11])) // 30% Further TEST_FURTHER
        expect(stats.getStatValue(StatTypeEnum.TEST_FURTHER)).toBeCloseTo(.37,4)
    })

    it('Stats with min or max defined should clamp final values', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_MIN_MAX_LINEAR]) //Max of 1, Min of -2
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[20])) // +2
        expect(stats.getStatValue(StatTypeEnum.TEST_MIN_MAX_LINEAR)).to.deep.equal(1)
        stats = new ActorStats([StatTypeEnum.TEST_MIN_MAX_LINEAR]) //Max of 1, Min of -2
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[21])) // -4
        expect(stats.getStatValue(StatTypeEnum.TEST_MIN_MAX_LINEAR)).to.deep.equal(-2)
    })
})

describe('Stats object should be throw exceptions when invalid combinations of bonuses are present', () => {
    it('Arithmetic stats can only accept arithmetic bonuses', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_POSITIVE_LINEAR])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[19]) // 80% Further TEST_POSITIVE_LINEAR
        expect(() => stats.addSource(bonus)).toThrowError('is typed arithmetic')
    })

    it('Further stats can only accept further bonuses', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_FURTHER])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[14]) // +10% TEST_FURTHER
        expect(() => stats.addSource(bonus)).toThrowError('is typed further')
    })

    it('Further quant type should reject values not between 0 and 1', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_FURTHER])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[12]) // -80% Further TEST_FURTHER
        expect(() => stats.addSource(bonus)).toThrowError('Further Bonus Error')
        stats = new ActorStats([StatTypeEnum.TEST_FURTHER])
        bonus = new BonusSource(MOCK_BONUS_SOURCES[13]) // 120% Further TEST_FURTHER
        expect(() => stats.addSource(bonus)).toThrowError('Further Bonus Error')
    })

    it('Stats with the no penalty trait should reject negative values', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_POSITIVE_LINEAR])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[16]) // -5 TEST_POSITIVE_LINEAR
        expect(() => stats.addSource(bonus)).toThrowError('does not allow penalties')
    })

    it('Stats with the linear only trait should reject geometric bonuses', () => {
        let stats = new ActorStats([StatTypeEnum.TEST_POSITIVE_LINEAR])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[17]) // 50% Increased TEST_POSITIVE_LINEAR
        expect(() => stats.addSource(bonus)).toThrowError('is linear only')
        stats = new ActorStats([StatTypeEnum.TEST_POSITIVE_LINEAR])
        bonus = new BonusSource(MOCK_BONUS_SOURCES[18]) // 80% More TEST_POSITIVE_LINEAR
        expect(() => stats.addSource(bonus)).toThrowError('is linear only')
        stats = new ActorStats([StatTypeEnum.TEST_POSITIVE_LINEAR])
        bonus = new BonusSource(MOCK_BONUS_SOURCES[19]) // 80% Further TEST_POSITIVE_LINEAR
        expect(() => stats.addSource(bonus)).toThrowError('is typed arithmetic')
    })
})

describe('Armor should be applied properly', () => {
    it('Add test armor 1', () => {
        let stats = new ActorStats()
        stats.setBaseArmor( { armorValue: 100, infusions: [] } )
        expect(stats.getStatValue(StatTypeEnum.Physical_Base_Armor)).to.deep.equal(100)
        expect(stats.getStatValue(StatTypeEnum.Fire_Base_Armor)).to.deep.equal(0)
        expect(stats.getStatValue(StatTypeEnum.Water_Base_Armor)).to.deep.equal(0)
    })

    it('Add test armor 2', () => {
        let stats = new ActorStats()
        stats.setBaseArmor( { armorValue: 100, infusions: [ { type: ElementalTypeEnum.Fire, level: 2 } ] } )
        expect(stats.getStatValue(StatTypeEnum.Physical_Base_Armor)).to.deep.equal(100)
        expect(stats.getStatValue(StatTypeEnum.Fire_Base_Armor)).toBeCloseTo(66.6666, 2)
        expect(stats.getStatValue(StatTypeEnum.Water_Base_Armor)).to.deep.equal(0)
    })

    it('Add test armor 3', () => {
        let stats = new ActorStats()
        stats.setBaseArmor( { armorValue: 100, infusions: [ { type: ElementalTypeEnum.Fire, level: 1 }, { type: ElementalTypeEnum.Arcane, level: 10 } ] } )
        expect(stats.getStatValue(StatTypeEnum.Physical_Base_Armor)).to.deep.equal(100)
        expect(stats.getStatValue(StatTypeEnum.Fire_Base_Armor)).toBeCloseTo(50, 2)
        expect(stats.getStatValue(StatTypeEnum.Arcane_Base_Armor)).toBeCloseTo(90.91, 2)
        expect(stats.getStatValue(StatTypeEnum.Water_Base_Armor)).to.deep.equal(0)
    })
})

describe('Static stats should be updated properly', () => {
    it('Check speed', () => {
        let stats = new ActorStats()
        expect(stats.getStatValue(StatTypeEnum.Speed)).toBeCloseTo(0,2)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[22])) // +2 Agility, +2 Alacrity
        expect(stats.getStatValue(StatTypeEnum.Speed)).toBeCloseTo(1.24,2)
        stats.addSource(new BonusSource(MOCK_BONUS_SOURCES[23])) // +5 Agility, -2 Alacrity
        expect(stats.getStatValue(StatTypeEnum.Speed)).toBeCloseTo(1.83,2)
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[24]) // +2 Speed
        expect(() => stats.addSource(bonus)).toThrowError('does not allow modification')
    })
})

describe('Stats with damage types should be updated properly', () => {
    it('Untyped bonuses shouldnt apply to typed stats', () => {
        let stats = new ActorStats([StatTypeEnum.Protection])
        let bonus = new BonusSource(MOCK_BONUS_SOURCES[26]) //+10% Undefined Protection
        expect(() => stats.addSource(bonus)).toThrowError('is damage typed')
    })
})