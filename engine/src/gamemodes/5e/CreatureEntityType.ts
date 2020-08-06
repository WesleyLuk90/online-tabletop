import {
    AttributeDescription,
    ComputedAttributeDescription,
    NumberAttributeDescription,
    SubEntityAttributeDescription,
} from "../../engine/models/AttributeDescription";
import { EntityType } from "../../engine/models/EntityType";
import { RollParser } from "../../engine/rolls/RollParser";
import { Collection } from "../../utils/Collection";
import { ItemEntityType } from "./ItemEntityType";

const StrengthAttribute = NumberAttributeDescription.create("str", "Str", 10);
const DexterityAttribute = NumberAttributeDescription.create("dex", "dex", 10);
const ConstitutionAttribute = NumberAttributeDescription.create(
    "con",
    "con",
    10
);

const IntelligenceAttribute = NumberAttributeDescription.create(
    "int",
    "int",
    10
);
const WisdomAttribute = NumberAttributeDescription.create("wis", "wis", 10);
const CharismaAttribute = NumberAttributeDescription.create("cha", "cha", 10);

const InventoryAttribute = SubEntityAttributeDescription.create(
    "inventory",
    "Inventory",
    ItemEntityType.id
);

export const CreatureEntityType = new EntityType(
    "creature",
    "Creature",
    "Creatures",
    Collection.of<AttributeDescription>(
        StrengthAttribute,
        DexterityAttribute,
        ConstitutionAttribute,
        IntelligenceAttribute,
        WisdomAttribute,
        CharismaAttribute,
        InventoryAttribute,
        ComputedAttributeDescription.create(
            "str_mod",
            "Str Mod",
            RollParser.parseChecked("floor((str-10)/2)")
        )
    )
);
