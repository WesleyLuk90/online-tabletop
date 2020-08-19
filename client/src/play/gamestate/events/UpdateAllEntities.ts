import { Entity } from "engine/models/Entity";
import { EntityCollection } from "../../EntityCollection";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateAllEntities implements GameEvent {
    constructor(private entities: Entity[]) {}

    update(gameState: GameState): GameState {
        return gameState.build((b) =>
            b.updateEntities(EntityCollection.fromEntities(this.entities))
        );
    }
}
