import { Campaign, CampaignSchema } from "protocol/src/Campaign";
import { newUUID } from "protocol/src/Id";
import { parse } from "protocol/src/Parse";
import { NotFoundError } from "../Errors";
import { Document, Field, MongoStorage } from "../storage/MongoStorage";

export class CampaignCollection extends MongoStorage<Campaign> {
    static PlayersUser = new Field("players.userID");

    collectionName() {
        return "campaigns";
    }

    parse(doc: Document) {
        return parse(doc, CampaignSchema);
    }

    id(c: Campaign) {
        return c.id;
    }

    fields() {
        return [CampaignCollection.PlayersUser];
    }
}

export class CampaignStorage {
    constructor(readonly campaignCollection: CampaignCollection) {}

    async list(userID: string): Promise<Campaign[]> {
        return this.campaignCollection.list(
            CampaignCollection.PlayersUser.contains(userID)
        );
    }

    async get(id: string): Promise<Campaign> {
        const campaign = await this.campaignCollection.get(id);
        if (campaign == null) {
            throw new NotFoundError("Campaign", id);
        }
        return campaign;
    }

    async create(campaign: Campaign): Promise<Campaign> {
        const c = { ...campaign, id: newUUID() };
        await this.campaignCollection.create(c);
        return c;
    }

    async update(campaign: Campaign): Promise<Campaign> {
        await this.campaignCollection.update(campaign);
        return campaign;
    }

    async delete(campaignID: string): Promise<void> {
        await this.campaignCollection.delete(campaignID);
    }
}
