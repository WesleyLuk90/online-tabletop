import { newUUID } from "protocol/src/Id";
import { Layer, Scene } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { GameStateUpdater } from "./GameState";
import { ToolCreatableToken } from "./tools/Tool";

export class EventHandler {
    constructor(private updateGameState: (updater: GameStateUpdater) => void) {}

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
            return gameState.build(b => b.addToken(token));
        });
    }
}
