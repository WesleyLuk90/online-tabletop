import { CampaignRequests } from "../games/CampaignRequests";
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
}
