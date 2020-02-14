import { Token } from "protocol/src/Token";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateAllTokens implements GameEventType {
    constructor(private tokens: Token[]) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.updateTokens(this.tokens));
    }
}
