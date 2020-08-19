import { Scene } from "engine/engine/models/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestDeleteScene implements GameEvent {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        SceneRequests.delete(gameState.campaign.id, this.scene.sceneID);
        return gameState.build((b) => b.deleteScene(this.scene.sceneID));
    }
}
