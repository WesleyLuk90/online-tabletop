import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class DeleteEntity implements GameEvent {
    constructor(private entityID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.removeEntity(this.entityID));
    }
}
