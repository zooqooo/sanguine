import { itemTypeEnum } from "./DBTypes"

export interface ItemFeature {
    type: itemTypeEnum
}

export interface Ingredients_Base_Feature extends ItemFeature {
    type: itemTypeEnum.Ingredients_Base
}

export interface Ingredients_Sated_Tincture_Feature extends ItemFeature {
    type: itemTypeEnum.Ingredients_Sated_Tincture
}

export interface Ingredients_Pure_Tincture_Feature extends ItemFeature {
    type: itemTypeEnum.Ingredients_Pure_Tincture
}

export interface Goods_Base_Feature extends ItemFeature {
    type: itemTypeEnum.Goods_Base
}

export interface Goods_Jugan_Stone_Feature extends ItemFeature {
    type: itemTypeEnum.Goods_Jugan_Stone
}

export interface Alchemical_Product_Feature extends ItemFeature {
    type: itemTypeEnum.Alchemical_Product
}

export interface Gear_Accessory_Feature extends ItemFeature {
    type: itemTypeEnum.Gear_Accessory
}

export interface Gear_Armor_Feature extends ItemFeature {
    type: itemTypeEnum.Gear_Armor
}

export interface Gear_Magic_Implement_Feature extends ItemFeature {
    type: itemTypeEnum.Gear_Magic_Implement
}

export interface Gear_Weapon_Feature extends ItemFeature {
    type: itemTypeEnum.Gear_Weapon
}
