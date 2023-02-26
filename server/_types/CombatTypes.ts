import { dbBonusComponent } from "./DBTypes"
import { damagePreRoll } from "./StatTypes"

export enum ActionTypeEnum {
    Attack
}

export type gameTick = {
    tick: number,
    actors: Map<string, transitCombatActor> ,
    log: combatActionLog<combatActionEvent>[]
}

export type transitCombatActor = {
    id: string,
    waitTime: waitTime,
    location: number[],
    stance: transitCombatStance | undefined
}

export type waitTime = {
    type: "Wait" | "Lag",
    quantity: number,
    speed: number,
    ticks: number
}

export type transitCombatStance = {
    name: string
}

export type transitCombatAction<T extends combatActionInfo> = {
    name: string
    info: T
}

export interface combatActionInfo {
    type: ActionTypeEnum,
    waitTime: number,
    lagTime: number
}

export interface combatAttackInfo extends combatActionInfo {
    type: ActionTypeEnum.Attack,
    bonuses: dbBonusComponent[]
    damages: damagePreRoll[]
}

export type combatActionLog<T extends combatEvent> = {
    log: string
    event: T
}

export enum CombatEventTypeEnum {
    Action,
    Stance_Change,
    Status_Change,
    
}

export interface combatEvent {
    type: CombatEventTypeEnum
}

export interface combatActionEvent extends combatEvent {
    type: CombatEventTypeEnum.Action
}