import { parse } from "protocol/src/Parse";
import {
    getCampaignID,
    TokenDelta,
    TokenDeltaSchema
} from "protocol/src/TokenDelta";
import { Route } from "../Route";
import { CampaignPermissionService } from "./CampaignPermissionService";
import { TokenProcessor } from "./TokenProcessor";

export class TokenManager {
    constructor(
        private tokenProcessor: TokenProcessor,
        private permissionService: CampaignPermissionService
    ) {}
    routes(): Route[] {
        return [
            Route.create("post", "/api/campaigns/:id/tokens", (user, data) =>
                this.handleUpdate(user, parse(data.body(), TokenDeltaSchema))
            )
        ];
    }

    async handleUpdate(userID: string, update: TokenDelta) {
        return this.permissionService.requirePlayer(
            { campaignID: getCampaignID(update), userID },
            () => {
                this.tokenProcessor.enqueue(update);
                return {};
            }
        );
    }
}
