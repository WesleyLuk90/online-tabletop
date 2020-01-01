import { newUUID } from "protocol/src/Id";
import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";
import { SceneService } from "protocol/src/SceneService";
import { NotFoundError } from "../Errors";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";

function generateID({ campaignID, id }: { campaignID: string; id: string }) {
    return `${campaignID}/${id}`;
}

export class SceneStorage implements SceneService {
    storage: MongoStorage<Scene>;

    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage<Scene>(
            databaseProvider,
            "scenes",
            data => parse(data, SceneSchema),
            generateID
        );
    }

    async list(gameID: string): Promise<Scene[]> {
        return this.storage.list({ key: "campaignID", value: gameID });
    }

    async get({
        campaignID,
        sceneID
    }: {
        campaignID: string;
        sceneID: string;
    }): Promise<Scene> {
        const id = generateID({ campaignID, id: sceneID });
        const scene = await this.storage.get(
            generateID({ campaignID, id: sceneID })
        );
        return NotFoundError.checkNotNull(scene, "scene", id);
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
