import { Entity } from "protocol/src/Entity";
import { EntityDelta } from "protocol/src/EntityDelta";

export class EntityDeltaFactory {
    constructor(private source: string) {}

    create(entity: Entity): EntityDelta {
        return {
            type: "create",
            source: this.source,
            entity
        };
    }
}
