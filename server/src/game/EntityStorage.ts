import { Entity, EntitySchema } from "protocol/src/Entity";
import { parse } from "protocol/src/Parse";
import { NotFoundError } from "../Errors";
import { Document, Field, MongoStorage } from "../storage/MongoStorage";

interface EntityReference {
    campaignID: string;
    entityID: string;
}

function generateID({ campaignID, entityID }: EntityReference) {
    return `${campaignID}/${entityID}`;
}

export class EntityCollection extends MongoStorage<Entity> {
    static CampaignField = new Field("campaignID");

    collectionName() {
        return "entities";
    }

    parse(data: Document) {
        return parse(data, EntitySchema);
    }

    id(entity: Entity) {
        return generateID(entity);
    }

    fields() {
        return [EntityCollection.CampaignField];
    }
}

export class EntityStorage {
    constructor(readonly collection: EntityCollection) {}

    async list(campaignID: string): Promise<Entity[]> {
        return this.collection.list(
            EntityCollection.CampaignField.isEqualTo(campaignID)
        );
    }

    async get(ref: EntityReference): Promise<Entity> {
        const id = generateID(ref);
        const entity = await this.collection.get(generateID(ref));
        return NotFoundError.checkNotNull(entity, "entity", id);
    }

    async create(entity: Entity): Promise<Entity> {
        await this.collection.create(entity);
        return entity;
    }

    async update(entity: Entity): Promise<Entity> {
        await this.collection.update(entity);
        return entity;
    }

    async delete(ref: EntityReference): Promise<void> {
        return this.collection.delete(generateID(ref));
    }
}
