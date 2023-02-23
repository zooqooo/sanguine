import { ActionTypeEnum as CombatActionTypeEnum } from "../_types/ActionTypes"
import CombatActor from "./CombatActor"

export default class CombatAction {
    private actor: CombatActor
    private waitTime: number
    private type: CombatActionTypeEnum

    constructor(actor: CombatActor) {
        this.actor = actor
        this.waitTime = 10 
        this.type = CombatActionTypeEnum.Attack
    }

    getActor(): CombatActor {
        return this.actor
    }

    getWaitTime(): number {
        return this.waitTime
    }

    isAttack(): boolean {
        return this.type == CombatActionTypeEnum.Attack
    }
}