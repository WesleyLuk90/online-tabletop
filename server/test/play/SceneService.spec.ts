import { Sequelize } from "sequelize";
import { SceneService } from "../../src/play/SceneService";

describe("SceneService", () => {
    it("should create scenes", async () => {
        const sceneService = await SceneService.create(
            new Sequelize("sqlite://:memory:", { logging: () => {} })
        );
        const scene = {
            id: "scene-1",
            name: "My Scene",
            tokens: [
                {
                    x: 1,
                    y: 2,
                    width: 3,
                    height: 4,
                    id: "token-1"
                }
            ]
        };
        await sceneService.updateScene("1", scene);

        expect(await sceneService.list("1")).toEqual([scene]);
    });
});
