import SanguineActor from "./Actor"
import ActorInitializer from "./actor_stats/ActorInitializer"
import { serializedCharacter } from "./_types/SerializedTypes"
import { transitCharacter } from "./_types/TransitTypes"

export default class SanguineCharacter extends SanguineActor {
    private location: number
    private initialized: boolean
    private initializer?: ActorInitializer

    constructor(params: serializedCharacter) {
        super(params)
        this.location = params.location
        this.initialized = params.initialized
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getLocation() : number {
        return this.location
    }

    isInitialized() : boolean {
        return this.initialized
    }

    /* -----------------------------
               LOCATION
    ----------------------------- */

    setLocation(location: number): void {
        this.location = location
    }

    /* -----------------------------
              INITIALIZE
    ----------------------------- */

    beginCharacterInitialize(): { classChoices: string[], weaponChoices: string [] } {
        this.initializer = new ActorInitializer()
        let choices: { classChoices: string[], weaponChoices: string [] } = { classChoices: [], weaponChoices: [] }
        choices.classChoices = this.initializer.getClassChoices()
        choices.weaponChoices = this.initializer.getWeaponChoices()
        return choices
    }

    verifyCharacterInitialize(choices: { classChoice: number, weaponChoice: number }): void {
        if ( typeof this.initializer == 'undefined' ) {
            throw new Error('Attempted to verify charcter initilization without instantiating initializer')
        }

        const classBonus = this.initializer.getClassChoice(choices.classChoice)
        const weaponBonus = this.initializer.getWeaponChoice(choices.weaponChoice)

        // add appropriate weapon to inventory

        this.stats.addMultipleSources([classBonus, weaponBonus])
        this.initialized = true
    }

    /* -----------------------------
                SAVE
    ----------------------------- */

    transit() : transitCharacter {
        return {
            name : this.name,
            location: this.location,
            initialized: this.initialized,
            bonusSources: this.stats.transit()
        }
    }

    save() : serializedCharacter {
        return {
            name : this.name,
            location: this.location,
            initialized: this.initialized,
            inventory: this.inventory.save(),
            bonusSources: this.stats.save()
        }
    }
}