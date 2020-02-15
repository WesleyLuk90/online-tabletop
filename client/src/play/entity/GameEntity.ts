import { Attribute, Entity } from "protocol/src/Entity";
import { newUUID } from "protocol/src/Id";
import { assertExhaustive } from "../../util/Exaustive";
import { keyBy } from "../../util/Maps";
import { checkNotNull } from "../../util/Nullable";
import {
    AttributeDefinition,
    AttributeType,
    EntityType,
    GameMode
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
            attributes: []
        });
    }

    constructor(private entity: Entity) {
        this.attributes = keyBy(entity.attributes, a => a.attributeID);
    }

    private attributes: Map<string, Attribute>;

    entityID() {
        return this.entity.entityID;
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
        switch (attribute.type) {
            case AttributeType.Number:
                return "numberValue" in value
                    ? value.numberValue.toString()
                    : "";
            case AttributeType.Text:
            case AttributeType.RichText:
                return "stringValue" in value ? value.stringValue : "";
            default:
                assertExhaustive(attribute);
        }
    }

    getEntityType(gameMode: GameMode): EntityType {
        return checkNotNull(
            gameMode.entityTypes.find(e => this.entityTypeID() === e.id),
            "Failed to find entity type"
        );
    }

    getEntity() {
        return this.entity;
    }
}
