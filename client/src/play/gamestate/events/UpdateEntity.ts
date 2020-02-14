import { Entity } from "protocol/src/Entity";
import { GameEntity } from "../../entity/GameEntity";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateEntity implements GameEventType {
    constructor(private entity: Entity) {}

    update(gameState: GameState): GameState {
        return gameState.build(b =>
            b.updateEntity(new GameEntity(this.entity))
        );
    }
}
