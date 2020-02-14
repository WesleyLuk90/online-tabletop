import { Entity } from "protocol/src/Entity";
import { GameEntity } from "../../entity/GameEntity";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class AddEntity implements GameEvent {
    constructor(private entity: Entity) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.addEntity(new GameEntity(this.entity)));
    }
}
