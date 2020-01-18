import { parse } from "protocol/src/Parse";
import {
    getCampaignID,
    TokenDelta,
    TokenDeltaSchema
} from "protocol/src/TokenDelta";
import { Route } from "../Route";
import { CampaignPermissionService } from "./CampaignPermissionService";
import { TokenProcessor } from "./TokenProcessor";
import { TokenStorage } from "./TokenStorage";

export class TokenManager {
    constructor(
        private tokenProcessor: TokenProcessor,
        private permissionService: CampaignPermissionService,
        private tokenStorage: TokenStorage
    ) {}
    routes(): Route[] {
        return [
            Route.create(
                "get",
                "/api/campaigns/:campaignID/scenes/:sceneID/tokens",
                (user, data) =>
                    this.listTokens(
                        user,
                        data.url("campaignID"),
                        data.url("sceneID")
                    )
            ),
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

    async listTokens(userID: string, campaignID: string, sceneID: string) {
        return this.permissionService.requirePlayer(
            { campaignID, userID },
            () => this.tokenStorage.list({ campaignID, sceneID })
        );
    }
}
