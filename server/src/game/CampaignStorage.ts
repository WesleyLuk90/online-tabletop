import { Campaign } from "protocol/src/Campaign";
import { CampaignService } from "protocol/src/CampaignService";
import { MongoStorage } from "../storage/MongoStorage";

export class CampaignStorage implements CampaignService {
    constructor(readonly storage: MongoStorage<Campaign>) {}
    create(campaign: Campaign): Promise<Campaign> {}
    update(campaign: Campaign): Promise<Campaign> {}
    delete(campaignID: string): Promise<void> {}
}
