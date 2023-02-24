import { damageQuant, damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatAction from "./CombatAction"
import CombatActor from "./CombatActor"

export default class CombatAttack {
    private defenders: CombatActor[]
    private damages: damageQuant[]

    private accuracy: number
    private crit: boolean

    constructor(action: CombatAction) {
        this.defenders = new Array<CombatActor>()
        this.damages = new Array<damageQuant>()

        this.accuracy = 1
        this.crit = false

        // assert that no universal types appear in the damage types. Those types are only for defensive stats and for bonuses that apply to
        // multiple types the final attack must be of a specific type. So no DamageSuperTypeEnum.All or DamageBaseTypeEnum.Elemental etc.

        //   if there are any on-crit, pre-hit, or on-hit effects, they need to be stored to be retrieved by the combat class

        //   determine the accuracy
        // to calculate accuractly, the quantArrays from the stat will need to be
        // retrieved so thatthey can be combined with the bonuses from the action

        //   determine the advantage and disadvantage (as above)
        // then determine the alpha and beta values from the advantage and disadvantage

        //   determine the crit chance (as above)
        // once crit chance is calculated, the crit can be rolled immediatly

        //   determine max damage (as above)
        // if max damage is reduced, it may need to move the min damage as well

        //   roll damage
        // with all of those values in place, rolling damage can be done at this step

        //   add crit damage
        // if the attack was a crit, the additional crit damage needs to be added into the
        // raw damage array. The total crit damage percent will need to be determined as above

        //   determine bonus damage (as above)
        // bonus damage applies to raw damage, so once it is calculated, multply the
        // appropriate damage values and store them in the array

    }

    perform(): void {
        for ( const defender of this.defenders ) {
            this.processAttack(defender)
        }
    }

    private processAttack(defender: CombatActor): void {
        //evasion
        if ( defender.stats.performTrial(StatTypeEnum.Evasion, this.accuracy) ) {
            return
        }

        //apply crit effects and pre-hit effects

        //calculate, store, and apply damages
        let damages: damageQuant[] = []
        for ( const rawDamage of this.damages ) {
            const finalDamage = this.processDamage(rawDamage, defender)
            damages.push(finalDamage)
            defender.applyDamage(finalDamage)
        }
        
        //remove pre-hit effects
        //apply on-hit effects

        //retaliations
    }

    private processDamage ( damage: damageQuant, defender: CombatActor ): damageQuant {
        const damageType = damage.type
        let calcDamage = damage.quantity
        //protection
        const protection = defender.stats.getStatValue(StatTypeEnum.Protection, damageType)
        calcDamage = calcDamage - ( calcDamage * protection )
        //resistance
        const resistance = defender.stats.getStatValue(StatTypeEnum.Resistance, damageType)
        calcDamage = calcDamage - ( calcDamage * resistance )
        //armor
        const armor = defender.stats.getStatValue(StatTypeEnum.Armor, damageType)
        calcDamage = calcDamage * ( 100 / ( 100 + armor ) )
        //ward


        return { quantity: calcDamage, type: damageType}
    }
}