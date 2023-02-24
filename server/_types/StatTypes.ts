export enum ElementalTypeEnum {
	Fire,
	Water,
	Air,
	Earth,
	Arcane,
	Null
}

export enum QuantTypeEnum {
	Add,
	Increase,
	More,
	Further
}

export enum StatStackingTypeEnum {
	Arithmetic,
    Further,
    None
}

export enum StatTypeEnum {
    Vigor,
    Grit,
    Agility,
    Spirit,
    Presence,
    Tenacity,
    Alacrity,
    Physical_Base_Armor,
    Fire_Base_Armor,
    Water_Base_Armor,
    Air_Base_Armor,
    Earth_Base_Armor,
    Arcane_Base_Armor,
    Null_Base_Armor,
	Max_Stamina,
	Stamina_Regen,
	Max_Tension,
	Tension_Recovery,
	Exhaustion_Recovery,
	Dread_Recovery,
	Evasion,
	Discipline,
	Mettle,
	Pluck,
	Initiative,
	Protection,
	Resistance,
	Armor,
	Accuracy,
	Critical_Chance,
	Critical_Stamina_Damage,
	Critical_Tension_Damage,
	Max_Damage,
	Bonus_Damage,
	Advantage,
	Disadvantage,
	Max_Vitality,
	Exhaustion_Limit_1,
	Exhaustion_Limit_2,
	Exhaustion_Limit_3,
	Dread_Limit_1,
	Dread_Limit_2,
	Dread_Limit_3,
	Speed,
	TEST_POSITIVE_LINEAR,
	TEST_MIN_MAX_LINEAR,
	TEST_FURTHER,
    None
}

export enum DamageBaseTypeEnum {
	All,
	Physical,
	Special,
	Elemental,
	Slash,
	Pierce,
	Smash,
	Crit,
	Blast,
	Psychic,
	Precision,
	Fire,
	Water,
	Air,
	Earth,
	Arcane,
	Null
}

export enum DamageSuperTypeEnum {
	All,
	Stamina,
	Tension,
	Stall,
	Dread,
	Exhaustion
}

export type damageType = {baseType: DamageBaseTypeEnum, superType: DamageSuperTypeEnum}

export type damageQuant = {quantity: number, type: damageType}

export type statInfo = {
    name: StatTypeEnum,
    stacking: StatStackingTypeEnum,
    linearOnly?: boolean,
    noPenalty?: boolean,
    hasMin?: boolean,
    min?: number,
    hasMax?: boolean,
    max?: number,
    damageTyped?: boolean
}

export type damageAccumulatorInfo = {
	damageSuperType: DamageSuperTypeEnum
}