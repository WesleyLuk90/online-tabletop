import { newUUID } from "protocol/src/Id";
import { Token } from "protocol/src/Token";
import { TokenRequests } from "../../games/TokenRequests";
import { GameState } from "../gamestate/GameState";
import { TokenManager } from "../TokenManager";
import { GameTokenUpdate, TokenDeltaFactory } from "./TokenDeltaFactory";

export type CreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export class TokenService {
    constructor(
        private tokenDeltaFactory: TokenDeltaFactory,
        private tokenManager: TokenManager
    ) {}

    update(updates: GameTokenUpdate[]) {
        const deltas = this.tokenDeltaFactory.update(updates);
        this.tokenManager.updateToken(deltas);
        TokenRequests.update(deltas);
    }

    create(gameState: GameState, creatableToken: CreatableToken) {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return gameState;
        }
        const token: Token = {
            ...creatableToken,
            campaignID: gameState.campaign.id,
            sceneID: gameState.getMySceneID(),
            layerID: layer.id,
            tokenID: newUUID(),
            version: 0
        };
        const delta = this.tokenDeltaFactory.create(token);
        TokenRequests.create(delta);
        this.tokenManager.createToken(delta);
        return gameState;
    }
}
