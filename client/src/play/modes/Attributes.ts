import { checkNotNull } from "../../util/Nullable";
import { GameEntity } from "../entity/GameEntity";
import { AttributeDefinition, EntityType } from "./GameMode";

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
        attributeDefinition: AttributeDefinition,
        entity: GameEntity
    ): number {
        const attribute = entity.getAttribute(attributeDefinition);
        if (attribute == null || attribute.numberValue == null) {
            return 0;
        }
        return attribute.numberValue;
    }
}
