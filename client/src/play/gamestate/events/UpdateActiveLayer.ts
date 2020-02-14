import { Layer } from "protocol/src/Scene";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateActiveLayer implements GameEventType {
    constructor(private layer: Layer) {}

    update(gameState: GameState) {
        return gameState.build(b => b.withActiveLayer(this.layer));
    }
}
