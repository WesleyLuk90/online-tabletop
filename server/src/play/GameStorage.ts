import { CampaignService } from "./CampaignService";
import { Game } from "./Game";
import { SceneService } from "./SceneService";

export class GameStorage {
    constructor(
        private campaignService: CampaignService,
        private sceneService: SceneService
    ) {}

    async getGame(gameId: string) {
        const campaign = await this.campaignService.getCampaign(gameId);
        const scenes = await this.sceneService.listScenes(gameId);

        campaign.scenes = scenes;
        return new Game(gameId, campaign, this);
    }
}
