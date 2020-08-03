import { NumericAttributeDescription } from "../../engine/models/AttributeDescription";
import { EntityType } from "../../engine/models/EntityType";
import { Collection } from "../../utils/Collection";

const StrengthAttribute = new NumericAttributeDescription(
    "strength",
    "Str",
    "Strength",
    10
);
const DexterityAttribute = new NumericAttributeDescription(
    "dexterity",
    "dex",
    "Dexterity",
    10
);
const ConstitutionAttribute = new NumericAttributeDescription(
    "constitution",
    "con",
    "Constitution",
    10
);

const IntelligenceAttribute = new NumericAttributeDescription(
    "intelligence",
    "int",
    "Intelligence",
    10
);
const WisdomAttribute = new NumericAttributeDescription(
    "wisdom",
    "wis",
    "Wisdom",
    10
);
const CharismaAttribute = new NumericAttributeDescription(
    "charisma",
    "cha",
    "Charisma",
    10
);

export const CreatureEntityType = new EntityType(
    "creature",
    "Creature",
    "Creatures",
    Collection.of(
        StrengthAttribute,
        DexterityAttribute,
        ConstitutionAttribute,
        IntelligenceAttribute,
        WisdomAttribute,
        CharismaAttribute
    )
);
