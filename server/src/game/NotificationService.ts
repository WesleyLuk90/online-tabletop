import { Campaign } from "protocol/src/Campaign";
import { CreateToken, DeleteToken, UpdateToken } from "protocol/src/TokenDelta";
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

    tokenUpdated(campaignID: string, token: CreateToken | DeleteToken) {
        this.broadcastService.broadcast({
            type: "token",
            campaignID,
            update: token
        });
    }

    versionedTokenUpdated(fromVersion: number, token: UpdateToken) {
        this.broadcastService.broadcast({
            type: "token",
            campaignID: token.campaignID,
            update: { ...token, fromVersion: fromVersion }
        });
    }
}
