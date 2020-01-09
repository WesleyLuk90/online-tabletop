import { Colors } from "protocol/src/Color";
import { newUUID } from "protocol/src/Id";
import { Scene } from "protocol/src/Scene";

export class SceneService {
    static createDefaultScene(campaignID: string): Scene {
        return {
            sceneID: newUUID(),
            campaignID,
            layers: [
                {
                    color: Colors[1],
                    id: newUUID(),
                    name: "Tokens",
                    opacity: 1,
                    playerVisible: true
                },
                {
                    color: Colors[0],
                    id: newUUID(),
                    name: "Game Master",
                    opacity: 1,
                    playerVisible: false
                },
                {
                    color: Colors[2],
                    id: newUUID(),
                    name: "Background",
                    opacity: 1,
                    playerVisible: true
                }
            ],
            name: "My First Scene",
            gridSize: 70
        };
    }
}
