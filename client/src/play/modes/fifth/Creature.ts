import { Column, Control, Editor, Page, Row } from "../Editor";
import {
    EntityType,
    NumberAttribute,
    SubEntityAttribute,
    TextAttribute
} from "../GameMode";

export const CreatureType = new EntityType(
    "creature",
    "Creature",
    "Creatures",
    [
        new TextAttribute("name", "Name"),
        new NumberAttribute("health", "Health"),
        new NumberAttribute("str", "Strength", 10),
        new NumberAttribute("dex", "Agility", 10),
        new NumberAttribute("con", "Constitution", 10),
        new NumberAttribute("int", "Intelligence", 10),
        new NumberAttribute("wis", "Wisdom", 10),
        new NumberAttribute("cha", "Charisma", 10),
        new SubEntityAttribute("classes", "Classes", "class"),
        new SubEntityAttribute("items", "Items", "item")
    ],
    new Editor([
        new Page("Main", [
            new Row([
                new Column(10, [new Control("name")]),
                new Column(2, [new Control("health")]),
                new Column(2, [new Control("str")]),
                new Column(2, [new Control("dex")]),
                new Column(2, [new Control("con")]),
                new Column(2, [new Control("int")]),
                new Column(2, [new Control("wis")]),
                new Column(2, [new Control("cha")])
            ]),
            new Row([new Column(12, [new Control("items")])])
        ])
    ]),
    "name"
);
