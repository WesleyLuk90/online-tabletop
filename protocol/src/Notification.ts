import * as t from "io-ts";

const CampaignUpdate = t.strict({
    type: t.literal("campaign"),
    id: t.string
});

const TokenUpdate = t.strict({
    type: t.literal("token"),
    id: t.string
});

const UpdateSchema = t.union([CampaignUpdate, TokenUpdate]);
