import * as t from "io-ts";
import { CampaignValidator } from "./Campaign";
import { TokenValidator } from "./Token";

const UpdateCampaignValidator = t.type({
    type: t.literal("update-campaign"),
    id: t.string,
    campaign: CampaignValidator
});
export type UpdateCampaign = t.TypeOf<typeof UpdateCampaignValidator>;

const UpdateTokenValidator = t.type({
    type: t.literal("update-token"),
    id: t.string,
    sceneId: t.string,
    token: TokenValidator
});

export type UpdateToken = t.TypeOf<typeof UpdateTokenValidator>;

export const UpdatePlayersValidator = t.type({
    type: t.literal("update-players"),
    id: t.string,
    players: t.array(t.string)
});

export type UpdatePlayers = t.TypeOf<typeof UpdatePlayersValidator>;

export const MessageValidator = t.taggedUnion("type", [
    UpdateCampaignValidator,
    UpdateTokenValidator,
    UpdatePlayersValidator
]);

export type Message = t.TypeOf<typeof MessageValidator>;