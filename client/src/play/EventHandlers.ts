import { Layer, Scene } from "protocol/src/Scene";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { GameState } from "./GameState";

export class EventHandler {
    constructor(
        private updateGameState: (
            updater: (gameState: GameState) => GameState
        ) => void
    ) {}

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
}
