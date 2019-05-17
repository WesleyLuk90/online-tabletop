import { PlayPage } from "./PlayPage";
import {
    UpdateCampaign,
    UpdatePlayers,
    UpdateToken
} from "./protocol/Messages";

export interface MessageHandler<T> {
    (playPage: PlayPage, message: T): void;
}

export const UpdateCampaignHandler: MessageHandler<UpdateCampaign> = (
    playPage,
    updateCampaign
) => {
    playPage.setState({ campaign: updateCampaign.campaign });
};

export const UpdateTokenHandler: MessageHandler<UpdateToken> = (
    playPage,
    updateToken
) => {
    console.log("update token", updateToken);
};

export const UpdatePlayersHandler: MessageHandler<UpdatePlayers> = (
    playPage,
    players
) => {
    console.log("update players", players);
};
