import {
    NumberAttributeDescription,
    StringAttributeDescription,
} from "../../engine/models/AttributeDescription";
import { EntityType } from "../../engine/models/EntityType";
import { Collection } from "../../utils/Collection";

export const ItemEntityType = new EntityType(
    "item",
    "Item",
    "Items",
    Collection.of(
        StringAttributeDescription.create("name", "Name"),
        NumberAttributeDescription.create("weight", "Weight")
    )
);
