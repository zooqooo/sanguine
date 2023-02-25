import BonusSource from "./BonusSource"

export default class ActorInitializer {
    private weaponChoiceIndexes = ["Hammer Anima", "Axe Anima", "Spear Anima"]
    private classChoiceIndexes = ["Sanguine Hero", "Sanguine Explorer", "Sanguine Inquisitor"]
    //private gaiaActChoices

    constructor() {

    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getWeaponChoices(): string[] {
        return this.weaponChoiceIndexes
    }

    getClassChoices(): string[] {
        return this.classChoiceIndexes
    }

    getWeaponChoice( index: number ): BonusSource {
        return BonusSource.fromName(this.weaponChoiceIndexes[index])
    }

    getClassChoice( index: number ): BonusSource {
        return BonusSource.fromName(this.classChoiceIndexes[index])
    }
}