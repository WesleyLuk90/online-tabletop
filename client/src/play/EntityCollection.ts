import { Entity } from "protocol/src/Entity";
import { replaceValue } from "../util/List";
import { groupBy, keyBy } from "../util/Maps";
import { GameEntity } from "./entity/GameEntity";
import { EntityType } from "./modes/GameMode";

export class EntityCollection {
    static fromEntities(entities: Entity[]) {
        return new EntityCollection(entities.map(e => new GameEntity(e)));
    }

    static empty() {
        return new EntityCollection([]);
    }

    private entities: Map<string, GameEntity>;
    private byType: Map<string, GameEntity[]>;

    constructor(entities: GameEntity[]) {
        this.entities = keyBy(entities, e => e.entityID());
        this.byType = groupBy(entities, e => e.entityTypeID());
    }

    toList(): GameEntity[] {
        return Array.from(this.entities.values());
    }

    add(entity: GameEntity): EntityCollection {
        return new EntityCollection(
            Array.from(this.entities.values()).concat([entity])
        );
    }

    update(entity: GameEntity): EntityCollection {
        return new EntityCollection(
            replaceValue(
                this.toList(),
                e => e.entityID() === entity.entityID(),
                () => entity
            )
        );
    }

    delete(entityID: string): EntityCollection {
        return new EntityCollection(
            this.toList().filter(e => e.entityID() !== entityID)
        );
    }

    get(entityID: string): GameEntity | null {
        return this.entities.get(entityID) || null;
    }

    getByType(entityType: EntityType) {
        return this.byType.get(entityType.id) || [];
    }
}
