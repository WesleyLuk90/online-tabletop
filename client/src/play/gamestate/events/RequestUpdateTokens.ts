import { Token } from "protocol/src/Token";
import { TokenRequests } from "../../../games/TokenRequests";
import { TokenUpdate, TokenUpdater } from "../../tokens/TokenUpdater";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export type CreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export class RequestUpdateTokens implements GameEvent {
    constructor(private updates: TokenUpdate[]) {}

    update(gameState: GameState): GameState {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return gameState;
        }
        TokenRequests.update(this.updates, gameState.sessionID);
        const tokens = TokenUpdater.apply(
            gameState.tokens.asList(),
            this.updates
        );
        return gameState.build(b => b.updateTokens(tokens));
    }
}
