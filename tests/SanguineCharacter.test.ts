import { describe, expect, it } from 'vitest'
import ActorStats from '../server/actor_stats/ActorStats'
import BonusSource from '../server/actor_stats/BonusSource'
import SanguineCharacter, { serializedCharacter } from '../server/Character'
import Inventory from '../server/inventory/Inventory'
import Item from '../server/inventory/Item'
import { StatTypeEnum } from '../server/_types/StatTypes'
import { MOCK_BONUS_SOURCES } from './testdata/MockBonusSources'

const DUMMY_CHARACTER_1: serializedCharacter = {
  name: 'Bobby Bill',
  location: 1,
  initialized: true
}

export const DUMMY_CHARACTER_2: serializedCharacter = {
  name: 'Texas Red 77',
  location: 8,
  initialized: true,
  bonusSources: [
      "Sanguine Hero"
  ]
}

describe('Construct dummy character', () => {
  it('A character should be able to be constructed from the DUMMY_CHARACTER_1 serialized object', () => {
    let character = new SanguineCharacter(DUMMY_CHARACTER_1)

    expect(character.getName()).to.deep.equal('Bobby Bill')
    expect(character.getLocation()).to.deep.equal(1)
    expect(character.getInventory()).to.deep.equal(new Inventory())
    expect(character.getStats()).to.deep.equal(new ActorStats().getStatValues())
    
  })

  it('A character should be able to be constructed from the DUMMY_CHARACTER_2 serialized object', () => {
    let character = new SanguineCharacter(DUMMY_CHARACTER_2)

    expect(character.getName()).to.deep.equal('Texas Red 77')
    expect(character.getLocation()).to.deep.equal(8)


    expect(character.getInventory()).to.deep.equal(new Inventory())

    let mockStats = new ActorStats()
    mockStats.addSource(new BonusSource("Sanguine Hero"))

    expect(character.getStats()).to.deep.equal(mockStats.getStatValues())
  })
})

describe('Test Setters', () => {
  it('A character should be able to have its parameters modified by the setter methods', () => {
    let character = new SanguineCharacter(DUMMY_CHARACTER_2)

    expect(character.getLocation()).to.deep.equal(8)
    character.setLocation(5)
    expect(character.getLocation()).to.deep.equal(5)
  })
})

describe('Test Add to Inventory', () => {
  it('A character should be able to have items added to their inventory', () => {
    let character = new SanguineCharacter(DUMMY_CHARACTER_1)

    const SERIALIZED_ITEM_1 = {id: "Gold Thorn", quantity: 1}
    const SERIALIZED_ITEM_2 = {id: "Thunder Thistle", quantity: 3}
    const SERIALIZED_ITEM_3 = [{id: "Gold Thorn", quantity: 4}, {id: "Wind Bloom", quantity: 2}]

    const ITEM_1 = new Item(SERIALIZED_ITEM_1)
    const ITEM_2 = new Item(SERIALIZED_ITEM_2)
    const ITEM_3 = Item.serializedtoItems(SERIALIZED_ITEM_3)

    character.addToInventory(ITEM_1)
    expect(character.getInventory().getItemQuantity(SERIALIZED_ITEM_1.id)).to.deep.equal(SERIALIZED_ITEM_1.quantity)

    character.addToInventory(ITEM_2)
    expect(character.getInventory().getItemQuantity(SERIALIZED_ITEM_2.id)).to.deep.equal(SERIALIZED_ITEM_2.quantity)

    character.addMultipleToInventory(ITEM_3)
    expect(character.getInventory().getItemQuantity(SERIALIZED_ITEM_3[1].id)).to.deep.equal(SERIALIZED_ITEM_3[1].quantity)
    expect(character.getInventory().getItemQuantity(SERIALIZED_ITEM_3[0].id)).to.deep.equal(SERIALIZED_ITEM_3[0].quantity+SERIALIZED_ITEM_1.quantity)
  })
})

describe('Stat bonus sources should be able to be added and removed from a character', () => {
  it('Add and remove bonus sources', () => {
    let character = new SanguineCharacter(DUMMY_CHARACTER_1)
    expect(character.getStats()).to.deep.equal(new ActorStats().getStatValues())
    character.addBonusSource(new BonusSource(MOCK_BONUS_SOURCES[0]))
    character.addBonusSource(new BonusSource(MOCK_BONUS_SOURCES[1]))
    expect(character.getStat(StatTypeEnum.Vigor)).to.deep.equal(4)
    expect(character.getStat(StatTypeEnum.Grit)).to.deep.equal(2)
    expect(character.getStat(StatTypeEnum.Tenacity)).to.deep.equal(3)
    character.removeBonusSource(new BonusSource(MOCK_BONUS_SOURCES[1]))
    expect(character.getStat(StatTypeEnum.Vigor)).to.deep.equal(4)
    expect(character.getStat(StatTypeEnum.Grit)).to.deep.equal(2)
    expect(character.getStat(StatTypeEnum.Tenacity)).to.deep.equal(0)
  })
})