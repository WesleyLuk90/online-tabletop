import { SubEntity } from "protocol/src/Entity";
import { checkNotNull } from "../../util/Nullable";
import { GameEntity } from "../entity/GameEntity";
import {
    AttributeDefinition,
    EntityType,
    NumberAttribute,
    RichTextAttribute,
    SubEntityAttribute,
    TextAttribute
} from "./GameMode";

export class Attributes {
    static getNameAttributeDefinition(
        entityType: EntityType
    ): AttributeDefinition {
        return checkNotNull(
            entityType.attributes.find(
                a => a.id === entityType.nameAttributeID
            ),
            "Missing name attribute"
        );
    }

    static getAttribute(
        attributeID: string,
        entityType: EntityType
    ): AttributeDefinition {
        return checkNotNull(
            entityType.attributes.find(a => a.id === attributeID),
            `Missing attribute ${attributeID}`
        );
    }

    static getAttributeNumberValue(
        attributeDefinition: NumberAttribute,
        entity: GameEntity
    ): number {
        const attribute = entity.getAttribute(attributeDefinition);
        if (attribute == null || !("numberValue" in attribute)) {
            if (attributeDefinition.defaultValue != null) {
                return attributeDefinition.defaultValue;
            }
            return 0;
        }
        return attribute.numberValue;
    }

    static getAttributeStringValue(
        attributeDefinition: TextAttribute | RichTextAttribute,
        entity: GameEntity
    ): string {
        const attribute = entity.getAttribute(attributeDefinition);
        if (attribute == null || !("stringValue" in attribute)) {
            return "";
        }
        return attribute.stringValue;
    }

    static getSubEntityAttribute(
        attributeDefinition: SubEntityAttribute,
        entity: GameEntity
    ): SubEntity[] {
        const attribute = entity.getAttribute(attributeDefinition);
        if (attribute == null || !("entities" in attribute)) {
            return [];
        }
        return attribute.entities;
    }
}
