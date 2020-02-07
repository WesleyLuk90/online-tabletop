import { keyBy } from "../util/Maps";
import { GameEntity } from "./entity/GameEntity";

export class EntityCollection {
    static empty() {
        return new EntityCollection([]);
    }

    entities: Map<string, GameEntity>;

    constructor(entities: GameEntity[]) {
        this.entities = keyBy(entities, e => e.entityID());
    }

    update(entity: GameEntity): EntityCollection {
        const copy = new EntityCollection(Array.from(this.entities.values()));
        copy.entities.set(entity.entityID(), entity);
        return copy;
    }

    delete(entity: GameEntity): EntityCollection {
        const copy = new EntityCollection(Array.from(this.entities.values()));
        copy.entities.delete(entity.entityID());
        return copy;
    }

    get(entityID: string): GameEntity | null {
        return this.entities.get(entityID) || null;
    }
}
