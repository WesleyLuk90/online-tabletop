import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
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
            campaignID: scene.gameID
        });
    }
}
