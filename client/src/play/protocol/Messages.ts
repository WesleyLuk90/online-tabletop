import * as t from "io-ts";
import { TokenValidator } from "./Token";

const UpdateCampaignValidator = t.type({
    type: t.literal("update-campaign")
});

const UpdateToken = t.type({
    type: t.literal("update-token"),
    token: TokenValidator
});

export const MessageValidator = t.taggedUnion("type", [
    UpdateCampaignValidator,
    UpdateToken
]);
export type Message = t.TypeOf<typeof MessageValidator>;
