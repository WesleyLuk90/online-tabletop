import { Entity } from "protocol/src/Entity";
import { EntityCollection } from "../../EntityCollection";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateAllEntities implements GameEventType {
    constructor(private entities: Entity[]) {}

    update(gameState: GameState): GameState {
        return gameState.build(b =>
            b.updateEntities(EntityCollection.fromEntities(this.entities))
        );
    }
}
