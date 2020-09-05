import { lazy } from "engine";
import { Module } from "../Module";
import { Database } from "../storage/Database";
import { CampaignService } from "./CampaignService";
import { CampaignStore } from "./CampaignStore";

export class CampaignModule extends Module {
    constructor(readonly db: Database) {
        super();
    }

    store = lazy(() => new CampaignStore(this.db));
    service = lazy(() => new CampaignService(this.store()));
}
