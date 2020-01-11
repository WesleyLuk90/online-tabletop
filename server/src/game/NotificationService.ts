import { Campaign } from "protocol/src/Campaign";
import { Token } from "protocol/src/Token";
import { BroadcastService } from "./BroadcastService";
import { SceneReference } from "./SceneReference";

export function alsoNotify<T>(f: () => void): (t: T) => T {
    return t => {
        f();
        return t;
    };
}

export class NotificationService {
    constructor(readonly broadcastService: BroadcastService) {}

    campaignUpdated(campaign: Campaign) {
        this.broadcastService.broadcast({
            type: "campaign",
            campaignID: campaign.id
        });
    }

    sceneUpdated(scene: SceneReference) {
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
