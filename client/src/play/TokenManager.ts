import { GameStateUpdater } from "./GameState";

export class TokenManager {
    sceneId: string | null = null;
    constructor(private gameStateUpdater: GameStateUpdater) {}

    updateScene(sceneId: string | null) {
        const changed = this.sceneId !== sceneId;
        this.sceneId = sceneId;
        if (changed) {
        }
    }
}
