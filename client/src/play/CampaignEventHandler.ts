import { CampaignUpdate, SceneUpdate } from "protocol/src/Update";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { GameStateUpdate } from "./CampaignLoader";

export class CampaignEventHandler {
    constructor(private update: (update: GameStateUpdate) => void) {}

    async handleCampaignUpdate(campaignUpdate: CampaignUpdate) {
        const campaign = await CampaignRequests.get(campaignUpdate.campaignID);
        this.update(state => state.build(b => b.updateCampaign(campaign)));
    }

    async updateScene(update: SceneUpdate) {
        const scene = await SceneRequests.get(
            update.campaignID,
            update.sceneID
        );
        this.update(state => {
            if (scene == null) {
                return state.build(b => b.deleteScene(update.sceneID));
            } else {
                return state.build(b => b.upsertScene(scene));
            }
        });
    }
}
