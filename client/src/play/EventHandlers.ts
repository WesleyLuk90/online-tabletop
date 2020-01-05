import { GameState } from "./GameState";

export class EventHandler {
    constructor(private gameState: GameState) {}

    changeMyScene(sceneID: string) {
        const newCampaign = {
            ...this.gameState.campaign,
            players: this.gameState.campaign.players.map(p => {
                if (p.userID === this.gameState.user.id) {
                    return { ...p, sceneID: sceneID };
                } else {
                    return p;
                }
            })
        };
    }
}
