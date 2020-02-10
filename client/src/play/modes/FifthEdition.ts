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
        }
    ],
    editor: {
        pages: [
            {
                name: "Main",
                components: [
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
