import { CreateCampaign } from "engine";
import { Context } from "../api/Context";
import { Implementation } from "../api/Implementation";
import { Implementations } from "../api/Implementations";
import { CampaignStore } from "./CampaignStore";

export class CampaignApi implements Implementations {
    constructor(readonly campaignStore: CampaignStore) {}

    implementations() {
        return [
            new Implementation(CreateCampaign, this.createCampaign.bind(this)),
        ];
    }

    async createCampaign(ctx: Context, createCampaign: { name: string }) {
        return {};
    }
}
