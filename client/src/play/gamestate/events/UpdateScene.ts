import { Scene } from "protocol/src/Scene";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateScene implements GameEventType {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.upsertScene(this.scene));
    }
}
