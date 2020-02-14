import { GameEntity } from "../../entity/GameEntity";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestCreateEntity implements GameEvent {
    constructor(private entity: GameEntity) {}

    update(gameState: GameState): GameState {
        // FIXME
        return gameState;
    }
}
