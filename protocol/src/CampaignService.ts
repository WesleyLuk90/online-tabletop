import { Campaign } from "./Campaign";

export interface CampaignService {
    list(userID: string): Promise<Campaign[]>;
    get(campaignID: string): Promise<Campaign>;
    create(campaign: Campaign): Promise<Campaign>;
    update(campaign: Campaign): Promise<Campaign>;
    delete(campaignID: string): Promise<void>;
}
