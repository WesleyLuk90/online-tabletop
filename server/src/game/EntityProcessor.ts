import { applyDelta, EntityDelta } from "protocol/src/EntityDelta";
import { Lock } from "../util/Lock";
import { EntityReference, EntityStorage } from "./EntityStorage";
import { NotificationService } from "./NotificationService";

export class EntityProcessor {
    constructor(
        private entityStorage: EntityStorage,
        private notificationService: NotificationService
    ) {}

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
                await this.entityStorage.create(delta.entity);
                this.notificationService.entityUpdated(delta);
                return;
            case "delete":
                await this.entityStorage.delete(delta);
                this.notificationService.entityUpdated(delta);
                return;
            default:
                const entity = await this.entityStorage.get(delta);
                const updated = applyDelta(entity, delta);
                updated.version += 1;
                await this.entityStorage.update(updated);
                this.notificationService.versionedEntityUpdated(
                    entity.version,
                    delta
                );
        }
    }
}
