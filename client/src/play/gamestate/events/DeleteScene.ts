import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class DeleteScene implements GameEvent {
    constructor(private sceneID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.deleteScene(this.sceneID));
    }
}
