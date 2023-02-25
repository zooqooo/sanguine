export enum ActionTypeEnum {
    Attack
}

export type transitGameTick = {
    tick: number,
    actors: Map<string, transitCombatActor> ,
    log: transitActionLog[]
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

export type transitCombatAction = {
    name: string
}

export type transitActionLog = {
    log: string
    event: transitCombatEvent
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