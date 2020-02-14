import { Scene } from "protocol/src/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class RequestCreateScene implements GameEventType {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        SceneRequests.create(this.scene);
        return gameState.build(b => b.addScene(this.scene));
    }
}
