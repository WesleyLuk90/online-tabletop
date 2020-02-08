import { Entity } from "protocol/src/Entity";
import { newUUID } from "protocol/src/Id";
import { EntityType } from "../modes/GameMode";

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

    constructor(private entity: Entity) {}

    entityID() {
        return this.entity.entityID;
    }

    entityTypeID(): string {
        return this.entity.type;
    }
}
