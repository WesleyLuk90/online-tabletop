import { EntityDelta } from "protocol/src/EntityDelta";
import { newUUID } from "protocol/src/Id";
import { Token } from "protocol/src/Token";
import { EntityRequests } from "../games/EntityRequests";
import { TokenRequests } from "../games/TokenRequests";
import { GameStateUpdater } from "./CampaignLoader";
import { EntityDeltaFactory } from "./entity/EntityDeltaFactory";
import { GameEntity } from "./entity/GameEntity";
import { EntityManager } from "./EntityManager";
import { TokenManager } from "./TokenManager";
import { TokenUpdate } from "./tokens/TokenUpdater";
import { ToolCallbacks, ToolCreatableToken } from "./tools/Tool";

export class EventHandler {
    constructor(
        private sessionID: string,
        private updateGameState: GameStateUpdater,
        private deltaFactory: EntityDeltaFactory,
        private tokenManager: TokenManager,
        private entityManager: EntityManager
    ) {}

    createToolToken(created: ToolCreatableToken) {
        this.updateGameState(gameState => {
            const layer = gameState.getActiveLayer();
            if (layer == null) {
                return gameState;
            }
            const token: Token = {
                ...created,
                campaignID: gameState.campaign.id,
                sceneID: gameState.getMySceneID(),
                layerID: layer.id,
                tokenID: newUUID(),
                version: 0
            };
            TokenRequests.create(token, gameState.sessionID);
            return gameState.build(b => b.addToken(token));
        });
    }

    addSelection(tokens: Token[]) {
        this.updateGameState(gameState =>
            gameState.build(b => b.addSelection(tokens))
        );
    }

    updateSelection(tokens: Token[]) {
        this.updateGameState(gameState =>
            gameState.build(b => b.updateSelection(tokens))
        );
    }

    updateTokens(updates: TokenUpdate[]) {
        TokenRequests.update(updates, this.sessionID);
        // this.tokenManager.
        //FIXME
    }

    addEntity(entity: GameEntity) {
        this.updateGameState(gameState => {
            EntityRequests.update(gameState.campaign.id, [
                this.deltaFactory.create(entity.getEntity())
            ]);
            return gameState.build(b => b.addEntity(entity));
        });
    }

    updateEntity(delta: EntityDelta) {
        this.updateGameState(gameState => {
            EntityRequests.update(gameState.campaign.id, [delta]);
            return gameState; //FIXME
        });
    }

    toolCallbacks(): ToolCallbacks {
        return {
            createToken: t => this.createToolToken(t),
            addSelection: ts => this.addSelection(ts),
            updateSelection: ts => this.updateSelection(ts),
            updateTokens: t => this.updateTokens(t)
        };
    }

    editEntity(entity: GameEntity | null) {
        return this.updateGameState(s => s.build(s => s.setEditEntity(entity)));
    }
}
