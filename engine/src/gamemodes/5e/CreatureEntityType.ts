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

const InventoryAttribute = SubEntityAttributeDescription.create(
    "inventory",
    "Inventory",
    ItemEntityType.id
);

class AbilityScore {
    constructor(readonly shortName: string, readonly name: string) {}
}

const AbilityScores = [
    new AbilityScore("str", "Strength"),
    new AbilityScore("dex", "Dexterity"),
    new AbilityScore("con", "Constitution"),
    new AbilityScore("int", "Intelligence"),
    new AbilityScore("wis", "Wisdom"),
    new AbilityScore("cha", "Charisma"),
];

export const CreatureEntityType = new EntityType(
    "creature",
    "Creature",
    "Creatures",
    Collection.of<AttributeDescription>(
        ...AbilityScores.map((s) =>
            NumberAttributeDescription.create(s.shortName, s.name, 10)
        ),
        ...AbilityScores.map((s) =>
            ComputedAttributeDescription.create(
                `${s.shortName}_mod`,
                `${s.name} Modifier`,
                RollParser.parseChecked(`floor((${s.shortName}) / 10) - 2)`)
            )
        ),
        InventoryAttribute
    )
);
