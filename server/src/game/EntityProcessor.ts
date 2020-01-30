import { applyDelta, EntityDelta } from "protocol/src/EntityDelta";
import { Lock } from "../util/Lock";
import { EntityReference, EntityStorage } from "./EntityStorage";

export class EntityProcessor {
    constructor(private entityStorage: EntityStorage) {}

    queue(delta: EntityDelta) {
        this.lock.runExclusive(this.getReference(delta), () =>
            this.process(delta)
        );
    }

    private getReference(delta: EntityDelta): EntityReference {
        switch (delta.type) {
            case "create":
                return delta.entity;
            default:
                return delta;
        }
    }

    private lock = new Lock(
        ({ campaignID, entityID }: EntityReference) =>
            `${campaignID}/${entityID}`
    );

    private async process(delta: EntityDelta) {
        switch (delta.type) {
            case "create":
                return this.entityStorage.create(delta.entity);
            case "delete":
                return this.entityStorage.delete(delta);
            default:
                const entity = await this.entityStorage.get(delta);
                const updated = applyDelta(entity, delta);
                return this.entityStorage.update(updated);
        }
    }
}