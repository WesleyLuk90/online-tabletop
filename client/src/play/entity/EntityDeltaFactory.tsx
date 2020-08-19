import { Attribute, Entity } from "engine/engine/models/Entity";
import {
    EntityDelta,
    UpdateEntityDelta,
} from "engine/engine/models/EntityDelta";

export class EntityDeltaFactory {
    constructor(private campaignID: string, private source: string) {}

    create(entity: Entity): EntityDelta {
        return {
            type: "create",
            source: this.source,
            entity,
        };
    }

    attributeUpdate(entity: Entity, value: Attribute): UpdateEntityDelta {
        return {
            type: "update-attribute",
            attribute: value,
            campaignID: this.campaignID,
            entityID: entity.entityID,
            source: this.source,
            path: [],
        };
    }
}
