import { checkNotNull } from "../../util/Nullable";
import { GameEntity } from "../entity/GameEntity";
import {
    AttributeDefinition,
    EntityType,
    NumberAttribute,
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
        if (attribute == null || attribute.numberValue == null) {
            if (attributeDefinition.defaultValue != null) {
                return attributeDefinition.defaultValue;
            }
            return 0;
        }
        return attribute.numberValue;
    }

    static getAttributeStringValue(
        attributeDefinition: TextAttribute,
        entity: GameEntity
    ): string {
        const attribute = entity.getAttribute(attributeDefinition);
        if (attribute == null || attribute.stringValue == null) {
            return "";
        }
        return attribute.stringValue;
    }
}
