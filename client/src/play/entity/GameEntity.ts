import { Attribute, Entity } from "engine/engine/models/Entity";
import { newUUID } from "engine/engine/models/Id";
import { assertExhaustive } from "../../util/Exaustive";
import { keyBy } from "../../util/Maps";
import { checkNotNull } from "../../util/Nullable";
import {
    AttributeDefinition,
    EntityType,
    GameMode,
    NumberAttribute,
    RichTextAttribute,
    SubEntityAttribute,
    TextAttribute,
} from "../modes/GameMode";

export class GameEntity {
    static fromEntity(entity: Entity) {
        return new GameEntity(entity);
    }

    static create(campaignID: string, entityType: EntityType) {
        return new GameEntity({
            campaignID,
            entityID: newUUID(),
            type: entityType.id,
            version: 0,
            attributes: [],
        });
    }

    constructor(private entity: Entity) {
        this.attributes = keyBy(entity.attributes, (a) => a.attributeID);
    }

    private attributes: Map<string, Attribute>;

    entityID() {
        return this.entity.id;
    }

    entityTypeID(): string {
        return this.entity.type;
    }

    getAttribute(attribute: AttributeDefinition): Attribute | null {
        return this.attributes.get(attribute.id) || null;
    }

    formatAttribute(attribute: AttributeDefinition): string {
        const value = this.attributes.get(attribute.id);
        if (value == null) {
            return "";
        }

        if (attribute instanceof NumberAttribute) {
            return "numberValue" in value ? value.numberValue.toString() : "";
        } else if (
            attribute instanceof TextAttribute ||
            attribute instanceof RichTextAttribute
        ) {
            return "stringValue" in value ? value.stringValue : "";
        } else if (attribute instanceof SubEntityAttribute) {
            const entities = "entities" in value ? value.entities : [];
            return `${entities.length} ${attribute.name}`;
        } else {
            return assertExhaustive(attribute);
        }
    }

    getEntityType(gameMode: GameMode): EntityType {
        return checkNotNull(
            gameMode.entityTypes.find((e) => this.entityTypeID() === e.id),
            "Failed to find entity type"
        );
    }

    getEntity() {
        return this.entity;
    }
}
