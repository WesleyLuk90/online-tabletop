import { Scene } from "protocol/src/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class RequestDeleteScene implements GameEventType {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        SceneRequests.delete(gameState.campaign.id, this.scene.sceneID);
        return gameState.build(b => b.deleteScene(this.scene.sceneID));
    }
}
