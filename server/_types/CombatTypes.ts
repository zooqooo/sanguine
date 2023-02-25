import StatBonus from "../actor_stats/StatBonus"
import { dbBonusComponent } from "./DBTypes"
import { damagePreRoll } from "./StatTypes"

export enum ActionTypeEnum {
    Attack
}

export type transitGameTick = {
    tick: number,
    actors: Map<string, transitCombatActor> ,
    log: transitActionLog<transitCombatActionEvent>[]
}

export type transitCombatActor = {
    id: string,
    waitTime: transitWaitTime,
    location: number[],
    stance: transitCombatStance | undefined
}

export type transitWaitTime = {
    type: "Wait" | "Lag",
    quantity: number,
    speed: number,
    ticks: number
}

export type transitCombatStance = {
    name: string
}

export type transitCombatAction<T extends transitCombatActionInfo> = {
    name: string
    info: T
}

export interface transitCombatActionInfo {
    type: ActionTypeEnum,
    waitTime: number,
    lagTime: number
}

export interface transitCombatAttackInfo extends transitCombatActionInfo {
    type: ActionTypeEnum.Attack,
    bonuses: dbBonusComponent[]
    damages: damagePreRoll[]
}

export type transitActionLog<T extends transitCombatEvent> = {
    log: string
    event: T
}

export enum CombatEventTypeEnum {
    Action,
    Stance_Change,
    Status_Change,
    
}

export interface transitCombatEvent {
    type: CombatEventTypeEnum
}

export interface transitCombatActionEvent extends transitCombatEvent {
    type: CombatEventTypeEnum.Action
}