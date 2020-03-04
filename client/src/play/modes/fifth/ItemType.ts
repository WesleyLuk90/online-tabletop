import { Editor } from "../Editor";
import { EntityType, TextAttribute } from "../GameMode";

export const ItemType = new EntityType(
    "item",
    "Item",
    "Items",
    [new TextAttribute("name", "Name")],
    new Editor([]),
    "name"
);
