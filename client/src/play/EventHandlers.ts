import { Scene } from "protocol/src/Scene";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { replaceValue } from "../util/List";
import { GameState } from "./GameState";

export class EventHandler {
    constructor(
        private updateGameState: (
            updater: (gameState: GameState) => GameState
        ) => void
    ) {}

    changeMyScene(sceneID: string) {
        this.updateGameState(gameState => {
            const updated = {
                ...gameState.campaign,
                players: replaceValue(
                    gameState.campaign.players,
                    p => p.userID === gameState.user.id,
                    p => ({ ...p, sceneID: sceneID })
                )
            };
            CampaignRequests.update(updated);
            return gameState.updateCampaign(updated);
        });
    }

    changeDefaultScene(sceneID: string) {
        this.updateGameState(gameState => {
            const updated = {
                ...gameState.campaign,
                sceneID
            };
            CampaignRequests.update(updated);
            return gameState.updateCampaign(updated);
        });
    }

    updateSceneDetails(sceneID: string, updates: Partial<Scene>) {
        this.updateGameState(gameState => {
            const original = gameState.scenes.find(s => s.sceneID === sceneID);
            if (original == null) {
                console.error(`Did not found scene with id ${sceneID}`);
                return gameState;
            }
            const updated = {
                ...original,
                ...updates,
                sceneID
            };
            SceneRequests.update(updated);
            return gameState.updateScene(updated);
        });
    }

    createScene(scene: Scene) {
        this.updateGameState(gameState => {
            SceneRequests.create(scene);
            return gameState.addScene(scene);
        });
    }

    deleteScene(scene: Scene) {
        this.updateGameState(gameState => {
            SceneRequests.delete(scene.campaignID, scene.sceneID);
            return gameState.deleteScene(scene);
        });
    }
}
