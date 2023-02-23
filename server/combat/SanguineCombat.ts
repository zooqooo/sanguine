import SanguineActor from "../Actor"
import { damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatAttack from "./CombatAttack"
import CombatActor from "./CombatActor"
import { interval, takeWhile } from "rxjs"

export default class SanguineCombat {
    private started: boolean
    private over: boolean
    private combatants: Map<string, CombatActor>
    private elapsedGameTicks: number
    private intervalMS: number
    
    constructor() {
        this.started = false
        this.over = false
        this.intervalMS = 1000
        this.elapsedGameTicks = 0
        this.combatants = new Map<string, CombatActor>()
    }
    
    /* -----------------------------
               GETTERS
    ----------------------------- */

    getCombatants(): Map<string, CombatActor> {
        return this.combatants
    }

    /* -----------------------------
               SETTERS
    ----------------------------- */

    //for testing use only
    setIntervalMS(intervalMS: number): void {
        this.intervalMS = intervalMS
    }
    
    addCombatant(actor: SanguineActor): Map<string, CombatActor> {
        const combatActor = new CombatActor(this.createID(actor.getName()), actor)
        this.combatants.set(combatActor.getID(), combatActor)
        return this.combatants
    }

    private createID(actorName: string): string {
        //returns a unique name for an actor based on the actors already in the combat scene
        //TODO: ensure return value doesn't intersect with existing members of the combat scene
        return actorName
    }
    
    /* -----------------------------
              COMBAT LOOP
    ----------------------------- */
    
    begin(): void {
        if ( this.started ) {
            throw new Error(`Combat already started`)
        }

        interval(this.intervalMS)
            .pipe(takeWhile(() => !this.over))
            .subscribe(() => {
                // there should be some sort of error handling for if the game tick stalls and fails to
                // complete in less than 1 second
                this.makeGameTick()
            })
    }

    private makeGameTick() {
        let readyActors: CombatActor[] = []
        for ( const [id, combatant] of this.combatants ) {
            const readyToAct = combatant.makeGameTick()
            if ( readyToAct ) {
                readyActors.push(combatant)
            }
        }
        if ( readyActors.length > 0 ) this.takeActions(readyActors)
        this.updateActorActions()
        this.elapsedGameTicks++
    }
    
    private updateActorActions(): void {
        //TODO loop through the actors and see if they've declared a stance or action
    }
    
    private takeActions(readyActors: CombatActor[]): void {
        readyActors.sort((a, b) => a.getWaitTime() < b.getWaitTime() ? -1 : a.getWaitTime() < b.getWaitTime() ? 1 : 0)
        while ( readyActors.length > 0 ) {
            const currentActor = readyActors.pop()!
            if ( currentActor.hasActionReady() ) {
                this.takeAction(currentActor)
            }
        }
    }

    private takeAction(actor: CombatActor): void {
        const action = actor.getAction()
        if ( action.isAttack() ) {
            const attack = new CombatAttack(action) //the constructor takes the action and determines all the random elements
            for ( const defender of attack.getDefenders() ) {
                this.processAttack(attack, defender) //the now static attack is then processed by each defender to determine the effectivness
            }
        }
        
        actor.resetWaitTime()
    }
        
    /* -----------------------------
            ACTION PROCESSORS
    ----------------------------- */
        
    private processAttack( attack: CombatAttack, defender: CombatActor ): void {
        //evasion
        if ( defender.performTrial(StatTypeEnum.Evasion, attack.getAccuracy()) ) {
            return
        }

        //apply crit effects and pre-hit effects

        //calculate, store, and apply damages
        let damages: { quantity: number, type: damageType }[] = []
        for ( const rawDamage of attack.getDamages() ) {
            const finalDamage = this.processDamage(rawDamage.quantity, rawDamage.type, defender)
            damages.push(finalDamage)
            defender.applyDamage(finalDamage)
        }
        
        //remove pre-hit effects
        //apply on-hit effects

        //retaliations
    }

    private processDamage ( damage: number, damageType: damageType, defender: CombatActor ): { quantity: number, type: damageType } {
        let calcDamage = damage
        //protection
        const protection = defender.getStat(StatTypeEnum.Protection, damageType)
        calcDamage = calcDamage - ( calcDamage * protection )
        //resistance
        const resistance = defender.getStat(StatTypeEnum.Resistance, damageType)
        calcDamage = calcDamage - ( calcDamage * resistance )
        //armor
        const armor = defender.getStat(StatTypeEnum.Armor, damageType)
        calcDamage = calcDamage * ( 100 / ( 100 + armor ) )
        //ward


        return { quantity: calcDamage, type: damageType}
    }
}