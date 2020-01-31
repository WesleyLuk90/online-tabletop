import { Role } from "protocol/src/Role";
import { checkPermissions } from "../Errors";
import { CampaignStorage } from "./CampaignStorage";

interface PermissionQuery {
    userID: string;
    campaignID: string;
}
interface EntityPermissionQuery {
    userID: string;
    entityIDs: string[];
    campaignID: string;
}

export class CampaignPermissionService {
    constructor(private campaignStorage: CampaignStorage) {}

    async requireManager<T>(
        { userID, campaignID }: PermissionQuery,
        success: () => T
    ): Promise<T> {
        checkPermissions(
            (await this.campaignStorage.get(campaignID)).players.some(
                p => p.userID === userID && p.role === Role.manager
            )
        );
        return success();
    }

    async requirePlayer<T>(
        { userID, campaignID }: PermissionQuery,
        success: () => T
    ): Promise<T> {
        checkPermissions(
            (await this.campaignStorage.get(campaignID)).players.some(
                p => p.userID === userID
            )
        );
        return success();
    }

    async requireEntityPermission<T>(
        { userID, campaignID, entityIDs }: EntityPermissionQuery,
        success: () => T
    ): Promise<T> {
        checkPermissions(
            (await this.campaignStorage.get(campaignID)).players.some(
                p => p.userID === userID
            )
        );
        return success();
    }
}
