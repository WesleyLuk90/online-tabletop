import { newUUID } from "protocol/src/Id";
import { Layer, Scene } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { TokenRequests } from "../games/TokenRequests";
import { GameStateUpdater } from "./CampaignLoader";
import { GameEntity } from "./entity/GameEntity";
import { TokenUpdate, TokenUpdater } from "./tokens/TokenUpdater";
import { ToolCallbacks, ToolCreatableToken } from "./tools/Tool";

export class EventHandler {
    constructor(private updateGameState: GameStateUpdater) {}

    changeMyScene(sceneID: string) {
        this.updateGameState(gameState => {
            const g = gameState.build(b => b.changeMyScene(sceneID));
            CampaignRequests.update(g.campaign);
            return g;
        });
    }

    changeDefaultScene(sceneID: string) {
        this.updateGameState(gameState => {
            const g = gameState.build(b => b.changeDefaultScene(sceneID));
            CampaignRequests.update(g.campaign);
            return g;
        });
    }

    updateSceneDetails(sceneID: string, updates: Partial<Scene>) {
        this.updateGameState(gameState => {
            const g = gameState.build(b => b.updateScene(sceneID, updates));
            SceneRequests.update(g.getScene(sceneID));
            return g;
        });
    }

    createScene(scene: Scene) {
        this.updateGameState(gameState => {
            SceneRequests.create(scene);
            return gameState.build(b => b.addScene(scene));
        });
    }

    deleteScene(scene: Scene) {
        this.updateGameState(gameState => {
            SceneRequests.delete(scene.campaignID, scene.sceneID);
            return gameState.build(b => b.deleteScene(scene.sceneID));
        });
    }

    createLayer(scene: Scene, layer: Layer) {
        this.updateLayer(scene, layer);
    }

    updateLayer(scene: Scene, layer: Layer) {
        this.updateGameState(gameState => {
            const g = gameState.build(b => b.upsertLayer(scene.sceneID, layer));
            SceneRequests.update(g.getScene(scene.sceneID));
            return g;
        });
    }

    deleteLayer(scene: Scene, layer: Layer) {
        this.updateGameState(gameState => {
            const g = gameState.build(b => b.deleteLayer(scene.sceneID, layer));
            SceneRequests.update(g.getScene(scene.sceneID));
            return g;
        });
    }

    changeActiveLayer(layer: Layer) {
        this.updateGameState(gameState =>
            gameState.build(b => b.withActiveLayer(layer))
        );
    }

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
        this.updateGameState(gameState => {
            TokenRequests.update(updates, gameState.sessionID);
            return gameState.build(b =>
                b.updateTokens(
                    TokenUpdater.apply(gameState.tokens.asList(), updates)
                )
            );
        });
    }

    addEntity(entity: GameEntity) {
        this.updateGameState(gameState => {
            return gameState.build(b => b.addEntity(entity));
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
}
