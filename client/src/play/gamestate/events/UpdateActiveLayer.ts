import { Layer } from "engine/engine/models/Scene";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateActiveLayer implements GameEvent {
    constructor(private layer: Layer) {}

    update(gameState: GameState) {
        return gameState.build((b) => b.withActiveLayer(this.layer));
    }
}
