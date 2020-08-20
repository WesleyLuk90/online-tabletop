import { Entity } from "engine/engine/models/Entity";
import {
    applyDelta,
    deltaEntityID,
    EntityDelta,
    UpdateEntityDelta,
} from "engine/engine/models/EntityDelta";
import { EntityRequests } from "../games/EntityRequests";
import { ConflictResolver } from "../util/ConflictResolver";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { AddEntity } from "./gamestate/events/AddEntity";
import { DeleteEntity } from "./gamestate/events/DeleteEntity";
import { DispatchGameEvent } from "./gamestate/events/GameEvent";
import { UpdateAllEntities } from "./gamestate/events/UpdateAllEntities";
import { UpdateEntity } from "./gamestate/events/UpdateEntity";

class EntityConflictResolver extends ConflictResolver<
    Entity,
    UpdateEntityDelta
> {
    constructor(
        sessionID: string,
        protected onUpdated: (entity: Entity) => void
    ) {
        super(sessionID);
    }

    protected getID(entity: Entity): string {
        return entity.id;
    }

    protected updateID(delta: UpdateEntityDelta): string {
        return deltaEntityID(delta);
    }

    protected applyUpdate(entity: Entity, delta: UpdateEntityDelta): Entity {
        return applyDelta(entity, delta);
    }
}

export class EntityManager {
    private debounce = new PromiseDebouncer<Entity[]>();
    private conflictResolver: EntityConflictResolver;

    constructor(
        private sessionID: string,
        private campaignID: string,
        private dispatch: DispatchGameEvent
    ) {
        this.conflictResolver = new EntityConflictResolver(sessionID, (e) => {
            this.dispatch(new UpdateEntity(e));
        });
    }

    async load() {
        const entities = await this.debounce.debounce(
            EntityRequests.list(this.campaignID)
        );
        this.conflictResolver.updateAll(entities);
        this.dispatch(new UpdateAllEntities(entities));
    }

    applyRemoteUpdate(update: EntityDelta) {
        switch (update.type) {
            case "create":
                if (update.source === this.sessionID) {
                    return;
                }
                return this.createEntity(update.entity);
            case "delete":
                if (update.source === this.sessionID) {
                    return;
                }
                return this.deleteEntity(update.id);
            default:
                this.conflictResolver.applyRemoteUpdate(update);
        }
    }

    createEntity(entity: Entity) {
        this.conflictResolver.add(entity);
        this.dispatch(new AddEntity(entity));
    }

    deleteEntity(entityID: string) {
        this.conflictResolver.remove(entityID);
        this.dispatch(new DeleteEntity(entityID));
    }

    updateEntity(update: UpdateEntityDelta) {
        this.conflictResolver.applyLocalUpdate(update);
    }
}
