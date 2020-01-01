import { Campaign } from "protocol/src/Campaign";
import { Colors } from "protocol/src/Color";
import { newUUID } from "protocol/src/Id";
import { Role } from "protocol/src/Role";
import { Scene } from "protocol/src/Scene";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";

function isManager(campaign: Campaign, userID: string) {
    return campaign.players.some(
        p => p.userID === userID && p.role === Role.manager
    );
}

export class CampaignLoader {
    static async loadCampaign(
        campaignID: string,
        userID: string
    ): Promise<[Campaign, Scene[]]> {
        const campaign = await CampaignRequests.get(campaignID);
        const scenes = await SceneRequests.list(campaignID);
        if (scenes.length === 0 && isManager(campaign, userID)) {
            const defaultScene = this.defaultScene(campaignID);
            await SceneRequests.create(defaultScene);
            campaign.players.forEach(p => {
                p.sceneID = defaultScene.sceneID;
            });
            await CampaignRequests.update(campaign);
            return this.loadCampaign(campaignID, userID);
        }
        return [campaign, scenes];
    }

    static defaultScene(campaignID: string): Scene {
        return {
            sceneID: newUUID(),
            campaignID,
            layers: [
                {
                    color: Colors[1],
                    id: newUUID(),
                    name: "Tokens",
                    opacity: 1,
                    playerVisible: true
                },
                {
                    color: Colors[0],
                    id: newUUID(),
                    name: "Game Master",
                    opacity: 1,
                    playerVisible: false
                },
                {
                    color: Colors[2],
                    id: newUUID(),
                    name: "Background",
                    opacity: 1,
                    playerVisible: true
                }
            ],
            name: "My First Scene"
        };
    }
}
