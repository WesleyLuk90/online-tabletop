import { Entity } from "protocol/src/Entity";
import {
    applyDelta,
    deltaEntityID,
    EntityDelta,
    UpdateEntityDelta
} from "protocol/src/EntityDelta";
import { EntityRequests } from "../games/EntityRequests";
import { Callback } from "../util/Callback";
import { ConflictResolver } from "../util/ConflictResolver";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameEntity } from "./entity/GameEntity";
import { EntityCollection } from "./EntityCollection";
import { GameEvent } from "./gamestate/events/GameEvent";
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
        private update: Callback<GameEvent>
    ) {
        this.conflictResolver = new EntityConflictResolver(sessionID, e =>
            this.update(new UpdateEntity(e))
        );
    }

    async load() {
        const entities = await this.debounce.debounce(
            EntityRequests.list(this.campaignID)
        );
        const manager = new EntityCollection(
            entities.map(GameEntity.fromEntity)
        );
        this.gameStateUpdater(g => g.build(b => b.updateEntities(manager)));
    }

    applyLocalUpdate(update: EntityDelta) {
        switch (update.type) {
            case "create":
                this.conflictResolver.add(update.entity);
                this.gameStateUpdater(g =>
                    g.build(b => b.addEntity(new GameEntity(update.entity)))
                );
                return;
            case "delete":
                this.conflictResolver.remove(update.entityID);
                this.gameStateUpdater(g =>
                    g.build(b => b.removeEntity(update.entityID))
                );
                return;
            default:
                this.conflictResolver.applyLocalUpdate(update);
        }
    }

    handleEntityUpdate(update: EntityDelta) {}
}
