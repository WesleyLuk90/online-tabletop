import { Entity } from "protocol/src/Entity";
import { EntityDelta } from "protocol/src/EntityDelta";

export class EntityDeltaFactory {
    static create(source: string, entity: Entity): EntityDelta {
        return {
            type: "create",
            source,
            entity
        };
    }
}
