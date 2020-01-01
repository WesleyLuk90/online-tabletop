import { Campaign, CampaignSchema } from "protocol/src/Campaign";
import { parse } from "protocol/src/Parse";
import { Role } from "protocol/src/Role";
import { checkPermissions } from "../Errors";
import { Route } from "../Route";
import { also } from "../util/Also";
import { CampaignStorage } from "./CampaignStorage";
import { NotificationService } from "./NotificationService";

export class CampaignManager {
    constructor(
        readonly storage: CampaignStorage,
        readonly notificationService: NotificationService
    ) {}

    routes(): Route[] {
        return [
            Route.create("get", "/api/campaigns", (userID, data) =>
                this.list(userID)
            ),
            Route.create("get", "/api/campaigns/:id", (userID, data) =>
                this.get(userID, data.url("id"))
            ),
            Route.create("post", "/api/campaigns", (userID, data) =>
                this.create(userID, parse(data.body(), CampaignSchema))
            ),
            Route.create("post", "/api/campaigns/:id", (userID, data) =>
                this.update(userID, parse(data.body(), CampaignSchema))
            ),
            Route.create("delete", "/api/campaigns/:id", (userID, data) =>
                this.delete(userID, data.url("id")).then(() => ({}))
            )
        ];
    }

    async list(userID: string): Promise<Campaign[]> {
        return this.storage.list(userID);
    }

    async get(userID: string, campaignID: string): Promise<Campaign> {
        return also(await this.storage.get(campaignID), c => {
            checkPermissions(
                c.ownerID === userID || c.players.some(p => p.userID === userID)
            );
        });
    }

    async create(userID: string, campaign: Campaign): Promise<Campaign> {
        campaign.ownerID = userID;
        campaign.players = [
            {
                userID,
                role: Role.manager,
                sceneID: ""
            }
        ];
        return this.storage.create(campaign);
    }

    async update(userID: string, campaign: Campaign): Promise<Campaign> {
        checkPermissions(
            (await this.storage.get(campaign.id)).ownerID === userID
        );
        return also(await this.storage.update(campaign), c =>
            this.notificationService.campaignUpdated(c)
        );
    }

    async delete(userID: string, campaignID: string): Promise<void> {
        checkPermissions(
            (await this.storage.get(campaignID)).ownerID === userID
        );
        return this.storage.delete(campaignID);
    }
}
