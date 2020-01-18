import { newUUID } from "protocol/src/Id";
import { Scene } from "protocol/src/Scene";
import { SceneCollection, SceneStorage } from "../../src/game/SceneStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("SceneStorage", () => {
    const db = new DbFixture(p => new SceneCollection(p));
    it("should store", async () => {
        const storage = new SceneStorage(await db.get());
        const scene: Scene = {
            name: "scene",
            campaignID: newUUID(),
            gridSize: 70,
            layers: [],
            sceneID: newUUID()
        };
        await storage.create(scene);
        expect(
            await storage.get({
                campaignID: scene.campaignID,
                sceneID: scene.sceneID
            })
        ).toEqual(scene);
        expect(await storage.list(scene.campaignID)).toEqual([scene]);
    });
});
