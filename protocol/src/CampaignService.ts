import { Campaign } from "./Campaign";

export interface CampaignService {
    create(campaign: Campaign): Promise<Campaign>;
    update(campaign: Campaign): Promise<Campaign>;
    delete(campaignID: string): Promise<void>;
}
