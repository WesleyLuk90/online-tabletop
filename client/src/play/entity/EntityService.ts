import { Attribute } from "engine/models/Entity";
import { newUUID } from "engine/models/Id";
import { EntityRequests } from "../../games/EntityRequests";
import { EntityManager } from "../EntityManager";
import { EntityType } from "../modes/GameMode";
import { EntityDeltaFactory } from "./EntityDeltaFactory";
import { GameEntity } from "./GameEntity";

export class EntityService {
    constructor(
        private campaignID: string,
        private entityManager: EntityManager,
        private entityDeltaFactory: EntityDeltaFactory
    ) {}

    createNew(entityType: EntityType) {
        const entity = {
            attributes: [],
            campaignID: this.campaignID,
            entityID: newUUID(),
            type: entityType.id,
            version: 0,
        };
        this.entityManager.createEntity(entity);
        const delta = this.entityDeltaFactory.create(entity);
        EntityRequests.update(this.campaignID, [delta]);
    }

    updateAttribute(entity: GameEntity, value: Attribute) {
        const delta = this.entityDeltaFactory.attributeUpdate(
            entity.getEntity(),
            value
        );
        this.entityManager.updateEntity(delta);
        EntityRequests.update(this.campaignID, [delta]);
    }
}
