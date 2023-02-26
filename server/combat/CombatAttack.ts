import beta from "@stdlib/random-base-beta"
import ActorStats from "../actor_stats/ActorStats"
import BonusSource from "../actor_stats/BonusSource"

import { combatAttackInfo } from "../_types/CombatTypes"
import { dbBonusComponent } from "../_types/DBTypes"
import { DamageBaseTypeEnum, damagePreRoll, damageQuant, DamageSuperTypeEnum, damageType, QuantTypeEnum, statBonus, StatTypeEnum } from "../_types/StatTypes"

export default class CombatAttack {
    private attackerStats: ActorStats
    private defenderStats: ActorStats[]
    private damages: damageQuant[]
    private statBonuses: statBonus[]
    //private statusBonuses:

    private accuracy: number
    private crit: boolean

    constructor(attackerStats: ActorStats, defenderStats: ActorStats[], action: combatAttackInfo, context: boolean) {
        this.attackerStats = attackerStats
        this.defenderStats = defenderStats
        this.damages = new Array<damageQuant>()
        const localBonusComponents = BonusSource.filterBonusComponentsByContext(action.bonuses, context)
        const localStatBonuses = BonusSource.statBonusFromBonusComponent(localBonusComponents)
        const actorStatBonuses = attackerStats.getStatBonuses(context)
        this.statBonuses = actorStatBonuses.concat(localStatBonuses)


        // assert that no universal types appear in the damage types. Those types are only for defensive stats and for bonuses that apply to
        // multiple types the final attack must be of a specific type. So no DamageSuperTypeEnum.All or DamageBaseTypeEnum.Elemental etc.
        for ( const damage of this.damages ) {
            this.checkForUniversalTypes(damage.type)
        }

        //   if there are any on-crit, pre-hit, or on-hit effects, they need to be stored to be retrieved by the combat class
        //   determine the accuracy
        const accuracyStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Accuracy))
        this.accuracy = this.attackerStats.getInstantStatValue(StatTypeEnum.Accuracy, accuracyStats)
        
        //   determine the crit chance
        const criticalChanceStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Critical_Chance))
        const criticalChance = this.attackerStats.getInstantStatValue(StatTypeEnum.Critical_Chance, criticalChanceStats)
        // once crit chance is calculated, the crit can be rolled immediatly
        this.crit = Math.random() < criticalChance

        const damages: damagePreRoll[] = []
        for ( const damage of damages ) {
            this.damages.push(this.calculateRawDamageQuant(damage))
        }

        //   add crit damage
        // if the attack was a crit, the additional crit damage needs to be added into the raw damage array
        if ( this.crit ) {
        const criticalStaminaDamageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Critical_Stamina_Damage))
        this.attackerStats.getInstantStatValue(StatTypeEnum.Critical_Stamina_Damage, criticalStaminaDamageStats)
        const criticalTensionDamageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Critical_Tension_Damage))
        this.attackerStats.getInstantStatValue(StatTypeEnum.Critical_Tension_Damage, criticalTensionDamageStats)
            // find applicable stamina damages and create new crit quants
            // find applicable tension damages and create new crit quants
            this.damages.push( { quantity: 1, type: { baseType: DamageBaseTypeEnum.Crit, superType: DamageSuperTypeEnum.Stamina } } )
            this.damages.push( { quantity: 1, type: { baseType: DamageBaseTypeEnum.Crit, superType: DamageSuperTypeEnum.Tension } } )
        }
    }

    private checkForUniversalTypes(type: damageType): void {
        const forbiddenBaseTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Physical, DamageBaseTypeEnum.Elemental, DamageBaseTypeEnum.Special]
        const forbiddenSuperTypes: DamageSuperTypeEnum[] = [DamageSuperTypeEnum.All]

        if ( forbiddenBaseTypes.includes(type.baseType) ) {
            throw new Error(`Forbidden damage type ${DamageBaseTypeEnum[type.baseType]} found on attack`)
        }

        if ( forbiddenSuperTypes.includes(type.superType) ) {
            throw new Error(`Forbidden damage type ${DamageBaseTypeEnum[type.superType]} found on attack`)
        }
    }

    private calculateRawDamageQuant(damage: damagePreRoll): damageQuant {
        //   determine max damage
        const maxDamageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Max_Damage))
        const maxDamageStat = {
            stat: StatTypeEnum.Max_Damage,
            quantity: damage.max,
            quantType: QuantTypeEnum.Add,
            damageType: damage.type
        }
        maxDamageStats.push(maxDamageStat)
        const maxDamage = this.attackerStats.getInstantStatValue(StatTypeEnum.Max_Damage, maxDamageStats, damage.type)
        
        let rolledDamage = 0
        if ( maxDamage <= damage.min ) {
            rolledDamage = maxDamage
        } else {
        const advantageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Advantage))
        const advantage = this.attackerStats.getInstantStatValue(StatTypeEnum.Advantage, advantageStats, damage.type)
        const disadvantageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Disadvantage))
        const disadvantage = this.attackerStats.getInstantStatValue(StatTypeEnum.Disadvantage, disadvantageStats, damage.type)
            const randomV = this.calculateAlphaBeta(advantage - disadvantage)
            rolledDamage = Math.floor(randomV * (maxDamage - damage.min + 1) + damage.min)
        }
        
        //   determine bonus damage
        // bonus damage applies to raw damage, so once it is calculated, multply the appropriate damage values and store them in the array
        // the final damage can be calculated in this step by taking the base damage calculated by the earlier steps and passing it into
        // the function as an additional StatBonus
        let bonusDamageStats = ActorStats.filterBonusSourcesByStat(this.statBonuses, this.attackerStats.getStat(StatTypeEnum.Bonus_Damage))
        const baseDamageStat = {
            stat: StatTypeEnum.Bonus_Damage,
            quantity: rolledDamage,
            quantType: QuantTypeEnum.Add,
            damageType: damage.type
        }
        bonusDamageStats.push(baseDamageStat)
        const quantity = this.attackerStats.getInstantStatValue(StatTypeEnum.Bonus_Damage, [], damage.type)

        return {quantity: quantity, type: damage.type}
    }

    private calculateAlphaBeta( delta: number ): number {
        let alphaV = 0
        let betaV = 0
        if ( delta == 0 ) {
            alphaV = 2
            betaV = 2
        } else if ( delta > 0 ) {
            alphaV = 1+delta
            betaV = 1
        } else {
            alphaV = 1
            betaV = 1+Math.abs(delta)
        }

        return beta( alphaV, betaV )
    }

    perform(): void {
        for ( const defender of this.defenderStats ) {
            this.processAttack(defender)
        }
    }

    private processAttack(defender: ActorStats): void {
        //evasion
        if ( defender.performTrial(StatTypeEnum.Evasion, this.accuracy) ) {
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

    private processDamage ( damage: damageQuant, defender: ActorStats ): damageQuant {
        const damageType = damage.type
        let calcDamage = damage.quantity
        //protection
        const protection = defender.getStatValue(StatTypeEnum.Protection, damageType)
        calcDamage = calcDamage - ( calcDamage * protection )
        //resistance
        const resistance = defender.getStatValue(StatTypeEnum.Resistance, damageType)
        calcDamage = calcDamage - ( calcDamage * resistance )
        //armor
        const armor = defender.getStatValue(StatTypeEnum.Armor, damageType)
        calcDamage = calcDamage * ( 100 / ( 100 + armor ) )
        //ward


        return { quantity: calcDamage, type: damageType}
    }
}