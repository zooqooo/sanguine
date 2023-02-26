import SanguineActor from "../Actor"
import CombatActor from "./CombatActor"
import { combatActionLog, combatActionEvent, transitCombatActor, gameTick } from "../_types/CombatTypes"

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

    transitActors() : Map<string, transitCombatActor> {
        let transitActors = new Map<string, transitCombatActor>()
        for ( const [id, actor] of this.combatants ) {
            transitActors.set(id, actor.transit())
        }
        return transitActors
    }

    /* -----------------------------
               SETTERS
    ----------------------------- */
    
    addCombatant(actor: SanguineActor): SanguineCombat {
        const combatActor = new CombatActor(this.createID(actor.getName()), actor)
        this.combatants.set(combatActor.getID(), combatActor)
        return this
    }

    private createID(actorName: string): string {
        let suffix: number = 1
        let name: string = `${actorName}_${suffix}` 
        let existingNames: string[] = Array.from(this.combatants.keys())
        for ( let i = 0; i < existingNames.length; i++ ) {
            if ( name == existingNames[i] ) {
                suffix++
                name = `${actorName}_${suffix}` 
                i = -1
            }
        }
        return name
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

    requestGameTick(): gameTick | "Processing" {
        if ( this.processing ) {
            return "Processing"
        }
        this.processing = true
        const gameTick = this.makeGameTick()
        this.elapsedGameTicks++
        this.processing = false
        return gameTick
    }

    private makeGameTick(): gameTick {
        let gameTick = {
            tick: this.elapsedGameTicks,
            actors: this.transitActors(),
            log: new Array<combatActionLog<combatActionEvent>>
        }
        let readyActors: CombatActor[] = []
        for ( const [id, combatant] of this.combatants ) {
            combatant.updateStance()
            const readyToAct = combatant.processWaitTime()
            if ( readyToAct ) {
                readyActors.push(combatant)
            }
        }
        gameTick.log = this.takeActions(readyActors)
        return gameTick
    }
    
    private takeActions(readyActors: CombatActor[]): Array<combatActionLog<combatActionEvent>> {
        let log = new Array<combatActionLog<combatActionEvent>>
        readyActors.sort((a, b) => a.getWaitTime() < b.getWaitTime() ? -1 : a.getWaitTime() < b.getWaitTime() ? 1 : 0)
        //actors should continue having their wait time tick below 0 while in lag time, so that they can be sorted properly here
        for ( const actor of readyActors ) {
            const logItem = actor.takeAction()
            if ( typeof logItem !== 'undefined' ) log.push(logItem)
        }
        return log
    }
}