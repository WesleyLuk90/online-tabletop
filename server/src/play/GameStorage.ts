import { CampaignService } from "./CampaignService";
import { Game } from "./Game";

export class GameStorage {
    constructor(private campaignService: CampaignService) {}

    async getGame(gameId: string) {
        const campaign = await this.campaignService.getCampaign(gameId);

        return new Game(gameId, campaign, this);
    }
}
