import { Campaign, CampaignSchema } from "protocol/src/Campaign";
import { CampaignService } from "protocol/src/CampaignService";
import { newUUID } from "protocol/src/Id";
import { parse } from "protocol/src/Parse";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";

type Indexes = keyof Campaign | "players.userID";

export class CampaignStorage implements CampaignService {
    storage: MongoStorage<Campaign, Indexes>;
    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage(
            databaseProvider,
            "campaigns",
            doc => parse(doc, CampaignSchema),
            c => c.id
        );
    }

    async list(userID: string): Promise<Campaign[]> {
        return this.storage.list({ key: "players.userID", value: userID });
    }

    async get(id: string): Promise<Campaign> {
        const campaign = await this.storage.get(id);
        if (campaign == null) {
            throw new Error(`Campaign with ID ${id} not found`);
        }
        return campaign;
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
