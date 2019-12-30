import { Campaign } from "protocol/src/Campaign";
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
            new Route<{}, { id: string }>(
                "get",
                "/api/campaign/{:id}",
                ({ data, userID }) => this.get(userID, data.query.id)
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
