import { PlayPage } from "./PlayPage";
import { UpdateCampaign } from "./protocol/Messages";

export interface MessageHandler<T> {
    handle(message: T): void;
}

export class UpdateCampaignHandler implements MessageHandler<UpdateCampaign> {
    constructor(readonly playPage: PlayPage) {
        void 0;
    }

    handle(updateCampaign: UpdateCampaign) {}
}
