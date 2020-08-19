import { CampaignUpdate, SceneUpdate } from "engine/models/Update";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { DeleteScene } from "./gamestate/events/DeleteScene";
import { DispatchGameEvent } from "./gamestate/events/GameEvent";
import { UpdateCampaign } from "./gamestate/events/UpdateCampaign";
import { UpdateScene } from "./gamestate/events/UpdateScene";

export class CampaignEventHandler {
    constructor(private update: DispatchGameEvent) {}

    async handleCampaignUpdate(campaignUpdate: CampaignUpdate) {
        const campaign = await CampaignRequests.get(campaignUpdate.campaignID);
        this.update(new UpdateCampaign(campaign));
    }

    async updateScene(update: SceneUpdate) {
        const scene = await SceneRequests.get(
            update.campaignID,
            update.sceneID
        );
        if (scene == null) {
            return this.update(new DeleteScene(update.sceneID));
        } else {
            return this.update(new UpdateScene(scene));
        }
    }
}
