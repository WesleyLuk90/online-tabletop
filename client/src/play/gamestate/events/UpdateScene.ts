import { Scene } from "engine/models/Scene";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateScene implements GameEvent {
    constructor(private scene: Scene) {}

    update(gameState: GameState): GameState {
        return gameState.build((b) => b.upsertScene(this.scene));
    }
}
