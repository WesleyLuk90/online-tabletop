import { newUUID } from "protocol/src/Id";
import { Token } from "protocol/src/Token";
import { TokenRequests } from "../../../games/TokenRequests";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export type CreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export class RequestCreateToken implements GameEvent {
    constructor(private token: CreatableToken) {}

    update(gameState: GameState): GameState {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return gameState;
        }
        const token: Token = {
            ...this.token,
            campaignID: gameState.campaign.id,
            sceneID: gameState.getMySceneID(),
            layerID: layer.id,
            tokenID: newUUID(),
            version: 0
        };
        TokenRequests.create(token, gameState.sessionID);
        return gameState.build(b => b.addToken(token));
    }
}
