import { Sequelize } from "sequelize";
import { Scene } from "../../../client/src/play/protocol/Scene";
import { SceneService } from "../../src/play/SceneService";

describe("SceneService", () => {
    it("should create scenes", async () => {
        const sceneService = await SceneService.create(
            new Sequelize("sqlite://:memory:", { logging: () => {} })
        );
        const scene: Scene = {
            id: "scene-1",
            name: "My Scene",
            tokens: []
        };
        await sceneService.updateScene("1", scene);

        expect(await sceneService.listScenes("1")).toEqual([scene]);

        await sceneService.updateScene("1", {
            id: "scene-1",
            name: "My Scene 2",
            tokens: []
        });
        await sceneService.updateToken("1", "scene-1", {
            x: 1,
            y: 2,
            width: 3,
            height: 4,
            id: "token-1"
        });

        expect(await sceneService.listScenes("1")).toEqual([
            {
                id: "scene-1",
                name: "My Scene 2",
                tokens: [
                    {
                        x: 1,
                        y: 2,
                        width: 3,
                        height: 4,
                        id: "token-1"
                    }
                ]
            }
        ]);
    });
});
