import { Campaign } from "protocol/lib/Campaign";
import { CampaignService } from "./CampaignService";
import { Game } from "./Game";

export class GameStorage {
    deferedUpdates: Map<string, Campaign> = new Map();

    constructor(private campaignService: CampaignService) {
        setTimeout(this.flushUpdates, 30000);
    }

    async getGame(gameId: string) {
        const campaign = await this.campaignService.getCampaign(gameId);

        return new Game(gameId, campaign, this);
    }

    saveGame(game: Game) {
        const id = game.id;
        const campaign = game.getCampaign();

        this.deferedUpdates.set(id, campaign);
    }

    flushUpdates = async () => {
        const keys = Array.from(this.deferedUpdates.keys());
        for (let gameId of keys) {
            const campaign = this.deferedUpdates.get(gameId);
            this.deferedUpdates.delete(gameId);
            try {
                await this.campaignService.update(gameId, campaign);
            } catch (e) {
                console.error(`Failed to save campaign ${gameId}`, e);
            }
        }
    };
}
