import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import { User } from "protocol/src/User";

export class GameState {
    constructor(
        readonly campaign: Campaign,
        readonly user: User,
        readonly scenes: Scene[]
    ) {}

    updateCampaign(campaign: Campaign): GameState {
        return new GameState(campaign, this.user, this.scenes);
    }

    getMyScene(): Scene | null {
        const player = this.campaign.players.find(
            p => p.userID === this.user.id
        );
        if (player == null) return null;
        return this.scenes.find(s => s.sceneID === player.sceneID) || null;
    }
}
