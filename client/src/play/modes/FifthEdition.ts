import { AttributeType, EntityType, GameMode } from "./GameMode";

export const CreatureType: EntityType = {
    id: "creature",
    name: "Creature",
    pluralName: "Creatures",
    attributes: [
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
                sections: [
                    {
                        label: "Basic",
                        rows: [
                            {
                                columns: [
                                    {
                                        width: 12,
                                        components: [
                                            {
                                                attributeID: "health"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
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
