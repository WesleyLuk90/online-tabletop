import { Entity } from "protocol/src/Entity";
import {
    applyDelta,
    deltaEntityID,
    EntityDelta,
    UpdateEntityDelta
} from "protocol/src/EntityDelta";
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
        return entity.entityID;
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
        sessionID: string,
        private campaignID: string,
        private dispatch: DispatchGameEvent
    ) {
        this.conflictResolver = new EntityConflictResolver(sessionID, e =>
            this.dispatch(new UpdateEntity(e))
        );
    }

    async load() {
        const entities = await this.debounce.debounce(
            EntityRequests.list(this.campaignID)
        );
        this.dispatch(new UpdateAllEntities(entities));
    }

    applyLocalUpdate(update: EntityDelta) {
        switch (update.type) {
            case "create":
                this.conflictResolver.add(update.entity);
                this.dispatch(new AddEntity(update.entity));
                return;
            case "delete":
                this.conflictResolver.remove(update.entityID);
                this.dispatch(new DeleteEntity(update.entityID));
                return;
            default:
                this.conflictResolver.applyLocalUpdate(update);
        }
    }

    handleEntityUpdate(update: EntityDelta) {}
}
