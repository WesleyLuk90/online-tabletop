import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class DeleteScene implements GameEventType {
    constructor(private sceneID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.deleteScene(this.sceneID));
    }
}
