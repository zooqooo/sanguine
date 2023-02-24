import { ActionTypeEnum } from "../_types/CombatTypes"
import CombatActor from "./CombatActor"

export default class CombatAction {
    private actor: CombatActor
    private waitTime: number
    private type: ActionTypeEnum

    constructor(actor: CombatActor) {
        this.actor = actor
        this.waitTime = 10 
        this.type = ActionTypeEnum.Attack
    }

    getActor(): CombatActor {
        return this.actor
    }

    getWaitTime(): number {
        return this.waitTime
    }

    isAttack(): boolean {
        return this.type == ActionTypeEnum.Attack
    }
}