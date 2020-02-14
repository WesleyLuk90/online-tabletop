import { newUUID } from "protocol/src/Id";
import { EntityRequests } from "../../games/EntityRequests";
import { EntityManager } from "../EntityManager";
import { EntityType } from "../modes/GameMode";
import { EntityDeltaFactory } from "./EntityDeltaFactory";

export class EntityService {
    constructor(
        private campaignID: string,
        private entityManager: EntityManager,
        private entityFactory: EntityDeltaFactory
    ) {}

    createNew(entityType: EntityType) {
        const entity = {
            attributes: [],
            campaignID: this.campaignID,
            entityID: newUUID(),
            type: entityType.id,
            version: 0
        };
        this.entityManager.createEntity(entity);
        const delta = this.entityFactory.create(entity);
        EntityRequests.update(this.campaignID, [delta]);
    }
}
