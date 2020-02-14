import { newUUID } from "protocol/src/Id";
import { Token } from "protocol/src/Token";
import { TokenRequests } from "../../../games/TokenRequests";
import { Services } from "../../Services";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export type CreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export class RequestCreateToken implements GameEvent {
    constructor(private token: CreatableToken, private services: Services) {}

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
        const delta = this.services.tokenDeltaFactory().create(token);
        TokenRequests.create(delta);
        this.services.tokenManager().createLocally(delta);
        return gameState;
    }
}
