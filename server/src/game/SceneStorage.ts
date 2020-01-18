import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";
import { NotFoundError } from "../Errors";
import { Document, Field, MongoStorage } from "../storage/MongoStorage";
import { SceneReference } from "./SceneReference";

function generateID({ campaignID, sceneID }: SceneReference) {
    return `${campaignID}/${sceneID}`;
}

export class SceneCollection extends MongoStorage<Scene> {
    static CampaignField = new Field("campaignID");

    collectionName() {
        return "scenes";
    }

    parse(doc: Document) {
        return parse(doc, SceneSchema);
    }

    id(scene: Scene) {
        return generateID(scene);
    }

    fields() {
        return [SceneCollection.CampaignField];
    }
}

export class SceneStorage {
    constructor(readonly collection: SceneCollection) {}

    async list(gameID: string): Promise<Scene[]> {
        return this.collection.list(
            SceneCollection.CampaignField.isEqualTo(gameID)
        );
    }

    async get(ref: SceneReference): Promise<Scene> {
        const id = generateID(ref);
        const scene = await this.collection.get(generateID(ref));
        return NotFoundError.checkNotNull(scene, "scene", id);
    }

    async create(scene: Scene): Promise<Scene> {
        await this.collection.create(scene);
        return scene;
    }

    async update(scene: Scene): Promise<Scene> {
        await this.collection.update(scene);
        return scene;
    }

    async delete(ref: SceneReference): Promise<void> {
        return this.collection.delete(generateID(ref));
    }
}
