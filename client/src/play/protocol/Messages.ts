import * as t from "io-ts";
import { CampaignValidator } from "./Campaign";
import { TokenValidator } from "./Token";

const UpdateCampaignValidator = t.type({
    type: t.literal("update-campaign"),
    campaign: CampaignValidator
});
export type UpdateCampaign = t.TypeOf<typeof UpdateCampaignValidator>;

const UpdateTokenValidator = t.type({
    type: t.literal("update-token"),
    token: TokenValidator
});

export type UpdateToken = t.TypeOf<typeof UpdateTokenValidator>;

export const MessageValidator = t.taggedUnion("type", [
    UpdateCampaignValidator,
    UpdateTokenValidator
]);

export type Message = t.TypeOf<typeof MessageValidator>;
