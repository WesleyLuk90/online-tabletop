import { Campaign, CampaignSchema } from "protocol/src/Campaign";
import { CampaignService } from "protocol/src/CampaignService";
import { newUUID } from "protocol/src/Id";
import { parse } from "protocol/src/Parse";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";

export class CampaignStorage implements CampaignService {
    storage: MongoStorage<Campaign>;
    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage<Campaign>(
            databaseProvider,
            "campaigns",
            doc => parse(doc, CampaignSchema),
            c => c.id
        );
    }

    async create(campaign: Campaign): Promise<Campaign> {
        const c = { ...campaign, id: newUUID() };
        await this.storage.create(c);
        return c;
    }

    async update(campaign: Campaign): Promise<Campaign> {
        await this.storage.update(campaign);
        return campaign;
    }

    async delete(campaignID: string): Promise<void> {
        await this.storage.delete(campaignID);
    }
}
