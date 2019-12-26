import { newUUID } from "protocol/src/Id";
import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";
import { SceneService } from "protocol/src/SceneService";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";

export class SceneStorage implements SceneService {
    storage: MongoStorage<Scene>;

    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage(
            databaseProvider,
            "scenes",
            data => parse(data, SceneSchema),
            s => `${s.gameID}/${s.id}`
        );
    }

    list(gameID: string): Promise<Scene[]> {
        return this.storage.list({ key: "gameID", value: gameID });
    }

    async create(scene: Scene): Promise<Scene> {
        const withID = { ...scene, id: newUUID() };
        await this.storage.create(withID);
        return withID;
    }

    async update(scene: Scene): Promise<Scene> {
        await this.storage.update(scene);
        return scene;
    }

    delete(scene: Scene): Promise<void> {
        return this.storage.delete(this.storage.id(scene));
    }
}
