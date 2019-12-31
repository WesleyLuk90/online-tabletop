import Axios from "axios";
import { Campaign, CampaignSchema } from "protocol/src/Campaign";
import { parse } from "protocol/src/Parse";

function toCampaign(data: any): Campaign {
    return parse(data, CampaignSchema);
}

export class CampaignRequests {
    static async create(campaign: Campaign): Promise<Campaign> {
        const response = await Axios.post("/api/campaigns", campaign);
        return toCampaign(response.data);
    }

    static async get(id: string): Promise<Campaign> {
        const response = await Axios.get(`/api/campaigns/${id}`);
        return toCampaign(response.data);
    }

    static async list(): Promise<Campaign[]> {
        const response = await Axios.get("/api/campaigns");
        return response.data.map(toCampaign);
    }

    static async update(campaign: Campaign): Promise<Campaign> {
        const response = await Axios.post(
            `/api/campaigns/${campaign.id}`,
            campaign
        );
        return toCampaign(response.data);
    }

    static async delete(campaign: Campaign): Promise<void> {
        await Axios.delete(`/api/campaigns/${campaign.id}`);
    }
}
