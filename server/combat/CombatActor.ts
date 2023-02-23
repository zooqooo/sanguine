import SanguineActor from "../Actor"
import { damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatAction from "./CombatAction"

export default class CombatActor {
    private id: string
    private actor: SanguineActor
    private waitTime: number
    private action: CombatAction | undefined
    
    constructor(id: string, actor: SanguineActor) {
        this.id = id
        this.actor = actor
        this.waitTime = 100 * ( 1 - actor.getStat(StatTypeEnum.Initiative) )
    }
    
    /* -----------------------------
               GETTERS
    ----------------------------- */

    getID(): string { 
        return this.id
    }

    getWaitTime(): number {
        return this.waitTime
    }

    getAction(): CombatAction {
        //returns the current combat action
        //new actions can only be declared between game ticks
        //as assurance that the action can't be undefined in the frames between when hasActionReady() is called and this is called
        if ( !this.hasActionReady() ) throw new Error(`Character ${this.id} went to take action but no action was declared`)
        return this.action!
    }
    
    hasActionReady(): boolean {
        //returns true if the player/AI has an action declared
        //returns false if this.action is undefined
        return false
    }

    getStat(name: StatTypeEnum, damageType?: damageType): number {
        return this.actor.getStat(name)
    }

    performTrial(statName: StatTypeEnum, difficulty: number): boolean {
        return this.actor.performTrial(statName, difficulty)
    }

    /* -----------------------------
               SETTERS
    ----------------------------- */

    setAction(action: CombatAction): void {
        this.action = action
    }

    resetAction(): void {
        this.action = undefined
    }

    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    makeGameTick(): boolean {
        const speed = this.actor.getStat(StatTypeEnum.Speed)
        this.waitTime = this.waitTime = speed
        if ( this.waitTime <= 0 ) {
            return true
        } else {
            return false
        }
    }

    resetWaitTime(): void {
        const action = this.getAction()
        const waitTime = action.getWaitTime()
        this.waitTime = waitTime
    }
    
    applyDamage( damage: { quantity: number, type: damageType } ): void {
        
    }
    
}