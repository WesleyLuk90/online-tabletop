import { TokenRequests } from "../../../games/TokenRequests";
import { Services } from "../../Services";
import { GameTokenUpdate } from "../../tokens/TokenDeltaFactory";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestUpdateTokens implements GameEvent {
    constructor(
        private updates: GameTokenUpdate[],
        private services: Services
    ) {}

    update(gameState: GameState): GameState {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return gameState;
        }
        const deltas = this.services.tokenDeltaFactory().update(this.updates);
        TokenRequests.update(deltas);
        this.services.tokenManager().applyLocalUpdate(deltas);
        return gameState;
    }
}
