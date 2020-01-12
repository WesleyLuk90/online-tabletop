import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";
import { NotFoundError } from "../Errors";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { addProperty } from "../storage/Migrations";
import { MongoStorage } from "../storage/MongoStorage";
import { SceneReference } from "./SceneReference";

function generateID({ campaignID, sceneID }: SceneReference) {
    return `${campaignID}/${sceneID}`;
}

export class SceneStorage {
    storage: MongoStorage<Scene, keyof Scene>;

    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage<Scene, keyof Scene>(
            databaseProvider,
            "scenes",
            data => parse(data, SceneSchema),
            generateID,
            [],
            [addProperty("gridSize", 70)]
        );
    }

    async list(gameID: string): Promise<Scene[]> {
        return this.storage.list({ key: "campaignID", value: gameID });
    }

    async get(ref: SceneReference): Promise<Scene> {
        const id = generateID(ref);
        const scene = await this.storage.get(generateID(ref));
        return NotFoundError.checkNotNull(scene, "scene", id);
    }

    async create(scene: Scene): Promise<Scene> {
        await this.storage.create(scene);
        return scene;
    }

    async update(scene: Scene): Promise<Scene> {
        await this.storage.update(scene);
        return scene;
    }

    async delete(ref: SceneReference): Promise<void> {
        return this.storage.delete(generateID(ref));
    }
}
