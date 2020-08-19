import { Scene } from "engine/models/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestUpdateScene implements GameEvent {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        SceneRequests.update(this.scene);
        return gameState.build((b) => b.upsertScene(this.scene));
    }
}
