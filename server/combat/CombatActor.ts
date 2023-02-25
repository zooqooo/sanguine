import SanguineActor from "../Actor"
import ActorStats from "../actor_stats/ActorStats"
import { damageQuant, damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatAction from "./CombatAction"
import CombatAttack from "./CombatAttack"

export default class CombatActor {
    private id: string
    readonly actor: SanguineActor
    readonly stats: ActorStats
    private waitTime: number
    private action: CombatAction | undefined
    
    constructor(id: string, actor: SanguineActor) {
        this.id = id
        this.actor = actor
        this.stats = actor.stats
        this.waitTime = 100 * ( 1 - actor.stats.getStatValue(StatTypeEnum.Initiative) )
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
        this.updateStance()
        this.updateAction()
        const readyToAct = this.processWaitTime()
        return readyToAct
    }

    private processWaitTime(): boolean {
        // this needs to be able to handle lag time in addition to wait time
        // if they are in lag time, and it decrements to 0, a flag needs to be flipped in the action
        // to mark that the character is ready to act
        const speed = this.actor.stats.getStatValue(StatTypeEnum.Speed)
        this.waitTime = this.waitTime - speed
        if ( this.waitTime <= 0 && this.hasActionReady() ) {
            return true
        } else {
            return false
        }
    }

    updateStance(): void {
        //if the actor can select a stance
        //check the combat object for a declared stance
        //if declared stance is found, apply it to this actor
    }

    updateAction(): void {
        //if the actor can declare an action intent
        //check the combat object for a declared action
        //if declared stance is found, apply it to this actor
        //if there was a declared stance applied but the player has unassigned it,
        //clear the stored action
        //all using the set and reset action methods in this class
    }

    takeAction(): void {
        const action = this.getAction()
        // if the action has lag time and isn't flagged as ready to go
        // set the character's lag time to the action's lag time and return
        if ( action.isAttack() ) {
            const attack = new CombatAttack(this, action) //the constructor takes the action and determines all the random elements
            attack.perform()
        }
        
        this.resetWaitTime()
        this.resetAction()
    }

    resetWaitTime(): void {
        const action = this.getAction()
        const waitTime = action.getWaitTime()
        this.waitTime = waitTime
    }    
}