import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class DeleteEntity implements GameEventType {
    constructor(private entityID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.removeEntity(this.entityID));
    }
}
