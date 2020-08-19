import { Token } from "engine/models/Token";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateTokenEvent implements GameEvent {
    constructor(private token: Token) {}

    update(gameState: GameState): GameState {
        return gameState.build((b) => b.updateToken(this.token));
    }
}

export class DeleteTokenEvent implements GameEvent {
    constructor(private tokenID: string) {}

    update(gameState: GameState): GameState {
        return gameState.build((b) => b.removeToken(this.tokenID));
    }
}

export class AddTokenEvent implements GameEvent {
    constructor(private token: Token) {}

    update(gameState: GameState): GameState {
        if (!gameState.tokens.has(this.token.tokenID)) {
            return gameState.build((b) => b.addToken(this.token));
        } else {
            return gameState;
        }
    }
}
