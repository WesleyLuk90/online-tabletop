import { Scene } from "engine/models/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestCreateScene implements GameEvent {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        SceneRequests.create(this.scene);
        return gameState.build((b) => b.addScene(this.scene));
    }
}
