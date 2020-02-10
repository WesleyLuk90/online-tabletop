import { AttributeType, EntityType, GameMode } from "./GameMode";

export const CreatureType: EntityType = {
    id: "creature",
    name: "Creature",
    pluralName: "Creatures",
    nameAttributeID: "name",
    attributes: [
        {
            id: "name",
            name: "Name",
            type: AttributeType.Text
        },
        {
            id: "health",
            name: "Health",
            type: AttributeType.Number
        },
        {
            id: "str",
            name: "Strength",
            type: AttributeType.Number
        },
        {
            id: "dex",
            name: "Agility",
            type: AttributeType.Number
        },
        {
            id: "con",
            name: "Constitution",
            type: AttributeType.Number
        },
        {
            id: "int",
            name: "Intelligence",
            type: AttributeType.Number
        },
        {
            id: "wis",
            name: "Wisdom",
            type: AttributeType.Number
        },
        {
            id: "cha",
            name: "Charisma",
            type: AttributeType.Number
        }
    ],
    editor: {
        pages: [
            {
                name: "Main",
                components: [
                    {
                        type: "control",
                        attributeID: "str"
                    },
                    {
                        type: "control",
                        attributeID: "dex"
                    },
                    {
                        type: "control",
                        attributeID: "con"
                    },
                    {
                        type: "control",
                        attributeID: "int"
                    },
                    {
                        type: "control",
                        attributeID: "wis"
                    },
                    {
                        type: "control",
                        attributeID: "cha"
                    },
                    {
                        type: "control",
                        attributeID: "health"
                    }
                ]
            }
        ]
    }
};

export const FifthEdition: GameMode = {
    id: "5e",
    name: "5th Edition",
    entityTypes: [CreatureType],
    tokenEntities: [
        {
            entityTypeID: "creature"
        }
    ]
};
