import { serializedStatBonus } from "../_types/SerializedTypes"
import { DamageBaseTypeEnum, DamageSuperTypeEnum, damageType, QuantTypeEnum, StatTypeEnum } from "../_types/StatTypes"

export default class StatBonus {
    private id: string
    private stat: StatTypeEnum
    private quantity: number
    private quantType: QuantTypeEnum
    private quantMult: StatTypeEnum
    private damageType?: damageType

    constructor(id: string, config: serializedStatBonus) {
        this.id = id
        this.stat = config.stat
        this.quantity = config.quantity
        this.quantType = config.quantType
        this.quantMult = config.quantMult? config.quantMult : StatTypeEnum.None
        this.damageType = config.damageType? config.damageType : undefined
    }

    /* -----------------------------
                GETTERS
    ----------------------------- */

    getID(): string {
        return this.id
    }

    getStat() : StatTypeEnum {
        return this.stat
    }

    getQuantity(mult?: number) : number {
        mult = mult ? mult : 1
        let quant = this.quantity * mult
        return quant
    }

    getQuantType() : QuantTypeEnum {
        return this.quantType
    }

    isArithmetic(): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Add, QuantTypeEnum.Increase, QuantTypeEnum.More]
        return allowedTypes.includes(this.quantType)
    }

    isGeometric(): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Increase, QuantTypeEnum.More]
        return allowedTypes.includes(this.quantType)
    }

    isFurther(): boolean {
        const allowedTypes: QuantTypeEnum[] = [QuantTypeEnum.Further]
        return allowedTypes.includes(this.quantType)
    }

    getQuantMult(): StatTypeEnum {
        return this.quantMult
    }

    hasDamageType(): boolean {
        return typeof this.damageType !== 'undefined'
    }

    getDamageType(): damageType {
        if ( !this.hasDamageType() ) throw new Error(`Attempted to fetch damage type from stat bonus with no damage type. Source: ${this.id} Stat: ${this.stat}`)
        return this.damageType!
    }

    private static isPhysical(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Physical, DamageBaseTypeEnum.Slash, DamageBaseTypeEnum.Pierce, DamageBaseTypeEnum.Smash]
        return allowedTypes.includes(type)
    }

    private static isSpecial(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Special, DamageBaseTypeEnum.Crit, DamageBaseTypeEnum.Blast, DamageBaseTypeEnum.Psychic, DamageBaseTypeEnum.Precision]
        return allowedTypes.includes(type)
    }

    private static isElemental(type: DamageBaseTypeEnum): boolean {
        const allowedTypes: DamageBaseTypeEnum[] = [DamageBaseTypeEnum.All, DamageBaseTypeEnum.Elemental, DamageBaseTypeEnum.Fire, DamageBaseTypeEnum.Water, DamageBaseTypeEnum.Air, DamageBaseTypeEnum.Earth, DamageBaseTypeEnum.Arcane, DamageBaseTypeEnum.Null]
        return allowedTypes.includes(type)
    }
    
    private compareDamageSuperTypeContext( context: DamageSuperTypeEnum ): boolean {
        if ( context == DamageSuperTypeEnum.All ) return true
        
        let type = this.getDamageType().superType
        if ( type == DamageSuperTypeEnum.All ) return true
        if ( context == type ) return true

        return false        
    }

    private compareDamageBaseTypeContext( context: DamageBaseTypeEnum ): boolean {
        if ( context == DamageBaseTypeEnum.All ) return true

        let type = this.getDamageType().baseType
        if ( type == DamageBaseTypeEnum.All ) return true
        if ( context == type ) return true

        if ( context == DamageBaseTypeEnum.Physical && StatBonus.isPhysical(type) ) return true
        if ( context == DamageBaseTypeEnum.Elemental && StatBonus.isElemental(type) ) return true
        if ( context == DamageBaseTypeEnum.Special && StatBonus.isSpecial(type) ) return true

        if ( type == DamageBaseTypeEnum.Physical && StatBonus.isPhysical(context) ) return true
        if ( type == DamageBaseTypeEnum.Elemental && StatBonus.isElemental(context) ) return true
        if ( type == DamageBaseTypeEnum.Special && StatBonus.isSpecial(context) ) return true
        
        return false        
    }

    compareDamageContext( context: damageType | undefined ): boolean {
        if ( typeof context == 'undefined' ) return true
        if ( !this.hasDamageType() ) return true
        if ( !this.compareDamageSuperTypeContext(context.superType) ) return false
        if ( !this.compareDamageBaseTypeContext(context.baseType) ) return false
        return true
    }
}