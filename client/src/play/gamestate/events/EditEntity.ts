import { GameEntity } from "../../entity/GameEntity";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class EditEntity implements GameEvent {
    constructor(private entity: GameEntity) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.setEditEntity(this.entity));
    }
}
