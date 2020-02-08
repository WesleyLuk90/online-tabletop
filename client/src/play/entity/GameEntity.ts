import { Attribute, Entity } from "protocol/src/Entity";
import { newUUID } from "protocol/src/Id";
import { keyBy } from "../../util/Maps";
import { AttributeDefinition, EntityType } from "../modes/GameMode";

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
}
