import { Entity } from "engine/engine/models/Entity";
import { GameEntity } from "../../entity/GameEntity";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateEntity implements GameEvent {
    constructor(private entity: Entity) {}

    update(gameState: GameState): GameState {
        return gameState.build((b) =>
            b.updateEntity(new GameEntity(this.entity))
        );
    }
}
