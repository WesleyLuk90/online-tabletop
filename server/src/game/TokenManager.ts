import * as t from "io-ts";
import { parse } from "protocol/src/Parse";
import {
    getCampaignID,
    TokenDelta,
    TokenDeltaSchema
} from "protocol/src/TokenDelta";
import { BadRequestError } from "../Errors";
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
                this.handleUpdate(
                    user,
                    data.url("id"),
                    parse(data.body(), t.array(TokenDeltaSchema))
                )
            )
        ];
    }

    async handleUpdate(
        userID: string,
        campaignId: string,
        updates: TokenDelta[]
    ) {
        BadRequestError.check(
            updates.every(u => getCampaignID(u) === campaignId),
            "Campaign ids do not match"
        );
        return this.permissionService.requirePlayer(
            { campaignID: campaignId, userID },
            () => {
                updates.forEach(update => this.tokenProcessor.enqueue(update));
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
