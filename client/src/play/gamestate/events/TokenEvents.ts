import { Token } from "protocol/src/Token";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateTokenEvent implements GameEventType {
    constructor(private token: Token) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.updateToken(this.token));
    }
}

export class DeleteTokenEvent implements GameEventType {
    constructor(private tokenID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build(b => b.removeToken(this.tokenID));
    }
}

export class AddTokenEvent implements GameEventType {
    constructor(private token: Token) {}

    update(gameState: GameState): GameState {
        if (!gameState.tokens.has(this.token.tokenID)) {
            return gameState.build(b => b.addToken(this.token));
        } else {
            return gameState;
        }
    }
}
