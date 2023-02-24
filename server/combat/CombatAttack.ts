import StatBonus from "../actor_stats/StatBonus"
import { DamageBaseTypeEnum, damageQuant, DamageSuperTypeEnum, damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatAction from "./CombatAction"
import CombatActor from "./CombatActor"

export default class CombatAttack {
    private attacker: CombatActor
    private defenders: CombatActor[]
    private damages: damageQuant[]

    private accuracy: number
    private crit: boolean

    constructor(attacker: CombatActor, action: CombatAction) {
        this.attacker = attacker
        this.defenders = new Array<CombatActor>()
        this.damages = new Array<damageQuant>()

        this.accuracy = 1
        this.crit = false

        // assert that no universal types appear in the damage types. Those types are only for defensive stats and for bonuses that apply to
        // multiple types the final attack must be of a specific type. So no DamageSuperTypeEnum.All or DamageBaseTypeEnum.Elemental etc.
        for ( const damage of this.damages ) {
            this.checkForUniversalTypes(damage.type)
        }

        //   if there are any on-crit, pre-hit, or on-hit effects, they need to be stored to be retrieved by the combat class

        //   determine the accuracy
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Accuracy)
        
        //   determine the crit chance
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Critical_Chance)
        // once crit chance is calculated, the crit can be rolled immediatly

        //   determine the advantage and disadvantage
        const advantage = this.calculateBonusArrays(this.attacker.stats.getStatBonusQuants(StatTypeEnum.Advantage))
        const disadvantage = this.calculateBonusArrays(this.attacker.stats.getStatBonusQuants(StatTypeEnum.Disadvantage))
        // then determine the alpha and beta values from the advantage and disadvantage
        const [alpha, beta] = this.calculateAlphaBeta(advantage - disadvantage)
        
        //   determine max damage
        // if max damage is reduced, it may need to move the min damage as well
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Max_Damage)
        
        //   roll damage
        // with all of those values in place, rolling damage can be done at this step
        
        //   add crit damage
        // if the attack was a crit, the additional crit damage needs to be added into the raw damage array
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Critical_Stamina_Damage)
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Critical_Tension_Damage)
        
        //   determine bonus damage (as above)
        // bonus damage applies to raw damage, so once it is calculated, multply the appropriate damage values and store them in the array
        this.attacker.stats.getStatBonusQuants(StatTypeEnum.Bonus_Damage)
    }

    private checkForUniversalTypes(type: damageType): void {
        const forbiddenBaseTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Physical, DamageBaseTypeEnum.Elemental, DamageBaseTypeEnum.Special]
        const forbiddenSuperTypes: DamageSuperTypeEnum[] = [DamageSuperTypeEnum.All]

        for ( const forbiddenType of forbiddenBaseTypes ) {
            if ( type.baseType == forbiddenType ) throw new Error(`Forbidden damage type ${DamageBaseTypeEnum[forbiddenType]} found on attack`)
        }

        for ( const forbiddenType of forbiddenSuperTypes ) {
            if ( type.superType == forbiddenType ) throw new Error(`Forbidden damage type ${DamageSuperTypeEnum[forbiddenType]} found on attack`)
        }
    }

    private calculateBonusArrays(bonuses: StatBonus[]): number {
        return 0
    }

    private calculateAlphaBeta( delta: number ): [number, number] {
        if ( delta == 0 ) {
            return [2, 2]
        } else if ( delta > 0 ) {
            return [1+delta, 1]
        } else {
            return [1, 1+Math.abs(delta)]
        }
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