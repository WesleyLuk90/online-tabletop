import { Column, Control, Editor, Page, Row } from "./Editor";
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
            type: AttributeType.Number,
            defaultValue: 10
        },
        {
            id: "dex",
            name: "Agility",
            type: AttributeType.Number,
            defaultValue: 10
        },
        {
            id: "con",
            name: "Constitution",
            type: AttributeType.Number,
            defaultValue: 10
        },
        {
            id: "int",
            name: "Intelligence",
            type: AttributeType.Number,
            defaultValue: 10
        },
        {
            id: "wis",
            name: "Wisdom",
            type: AttributeType.Number,
            defaultValue: 10
        },
        {
            id: "cha",
            name: "Charisma",
            type: AttributeType.Number,
            defaultValue: 10
        }
    ],
    editor: new Editor([
        new Page("Main", [
            new Row([
                new Column(10, [new Control("name")]),
                new Column(2, [new Control("health")])
            ]),
            new Row([
                new Column(2, [new Control("str")]),
                new Column(2, [new Control("dex")]),
                new Column(2, [new Control("con")]),
                new Column(2, [new Control("int")]),
                new Column(2, [new Control("wis")]),
                new Column(2, [new Control("cha")])
            ])
        ])
    ])
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
