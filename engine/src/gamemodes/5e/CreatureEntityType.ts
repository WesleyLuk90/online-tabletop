import {
    AttributeDescription,
    NumberAttributeDescription,
    SubEntityAttributeDescription,
} from "../../engine/models/AttributeDescription";
import { EntityType } from "../../engine/models/EntityType";
import { Collection } from "../../utils/Collection";
import { ItemEntityType } from "./ItemEntityType";

const StrengthAttribute = NumberAttributeDescription.create(
    "strength",
    "Str",
    10
);
const DexterityAttribute = NumberAttributeDescription.create(
    "dexterity",
    "dex",
    10
);
const ConstitutionAttribute = NumberAttributeDescription.create(
    "constitution",
    "con",
    10
);

const IntelligenceAttribute = NumberAttributeDescription.create(
    "intelligence",
    "int",
    10
);
const WisdomAttribute = NumberAttributeDescription.create("wisdom", "wis", 10);
const CharismaAttribute = NumberAttributeDescription.create(
    "charisma",
    "cha",
    10
);

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
        InventoryAttribute
    )
);
