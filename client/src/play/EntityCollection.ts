import { Entity } from "protocol/src/Entity";
import { keyBy } from "../util/Maps";

export class EntityCollection {
    static empty() {
        return new EntityCollection([]);
    }

    entities: Map<string, Entity>;

    constructor(entities: Entity[]) {
        this.entities = keyBy(entities, e => e.entityID);
    }

    update(entity: Entity): EntityCollection {
        const copy = new EntityCollection(Array.from(this.entities.values()));
        copy.entities.set(entity.entityID, entity);
        return copy;
    }

    delete(entity: Entity): EntityCollection {
        const copy = new EntityCollection(Array.from(this.entities.values()));
        copy.entities.delete(entity.entityID);
        return copy;
    }

    get(entityID: string): Entity | null {
        return this.entities.get(entityID) || null;
    }
}
