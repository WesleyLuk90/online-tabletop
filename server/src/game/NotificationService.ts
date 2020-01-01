import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { BroadcastService } from "./BroadcastService";

export class NotificationService {
    constructor(readonly broadcastService: BroadcastService) {}

    campaignUpdated(campaign: Campaign) {
        this.broadcastService.broadcast({
            type: "campaign",
            campaignID: campaign.id
        });
    }

    sceneUpdated(scene: Scene) {
        this.broadcastService.broadcast({
            type: "scene",
            campaignID: scene.campaignID,
            sceneID: scene.sceneID
        });
    }

    tokenUpdated(token: Token) {
        this.broadcastService.broadcast({
            type: "token",
            campaignID: token.campaignID,
            sceneID: token.sceneID,
            tokenID: token.tokenID
        });
    }
}
