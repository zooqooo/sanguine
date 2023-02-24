import SanguineActor from "../Actor"
import { damageType, StatTypeEnum } from "../_types/StatTypes"
import CombatActor from "./CombatActor"
import { transitGameTick } from "../_types/CombatTypes"

export default class SanguineCombat {
    private started: boolean
    private processing: boolean
    private combatants: Map<string, CombatActor>
    private elapsedGameTicks: number
    
    constructor() {
        this.started = false
        this.processing = false
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

    setActorStance(): void {
        // retrieve input from user or from an AI and store the action in a map on this object
        // it might be worthwhile to check that the actor hasn't already declared a stance
    }

    setActorAction(): void {
        // retrieve input from user or from an AI and store the action in a map on this object
    }
    
    /* -----------------------------
              COMBAT LOOP
    ----------------------------- */
    
    begin(): void {
        if ( this.started ) {
            throw new Error(`Combat already started`)
        }

        this.started = true
        this.requestGameTick()
    }

    requestGameTick(): transitGameTick {
        if ( this.processing ) {
            return {}
        }
        this.processing = true
        const gameTick = this.makeGameTick()
        this.processing = false
        return gameTick
    }

    private makeGameTick(): transitGameTick {
        let readyActors: CombatActor[] = []
        for ( const [id, combatant] of this.combatants ) {
            const readyToAct = combatant.makeGameTick()
            if ( readyToAct ) {
                readyActors.push(combatant)
            }
        }
        if ( readyActors.length > 0 ) this.takeActions(readyActors)
        this.elapsedGameTicks++
        return {}
    }
    
    private takeActions(readyActors: CombatActor[]): void {
        readyActors.sort((a, b) => a.getWaitTime() < b.getWaitTime() ? -1 : a.getWaitTime() < b.getWaitTime() ? 1 : 0)
        while ( readyActors.length > 0 ) {
            const currentActor = readyActors.pop()!
            if ( currentActor.hasActionReady() ) {
                currentActor.takeAction()
            }
        }
    }
}