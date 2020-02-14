import { CampaignUpdate, SceneUpdate } from "protocol/src/Update";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { Callback } from "../util/Callback";
import { DeleteScene } from "./gamestate/events/DeleteScene";
import { GameEvent } from "./gamestate/events/GameEvent";
import { UpdateCampaign } from "./gamestate/events/UpdateCampaign";
import { UpdateScene } from "./gamestate/events/UpdateScene";

export class CampaignEventHandler {
    constructor(private update: Callback<GameEvent>) {}

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
