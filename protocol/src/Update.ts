import * as t from "io-ts";

const CampaignUpdateSchema = t.strict({
    type: t.literal("campaign"),
    campaignID: t.string
});

const SceneUpdateSchema = t.strict({
    type: t.literal("scene"),
    campaignID: t.string,
    sceneID: t.string
});

const TokenUpdateSchema = t.strict({
    type: t.literal("token"),
    campaignID: t.string,
    sceneID: t.string,
    tokenID: t.string
});

export const UpdateSchema = t.union([
    CampaignUpdateSchema,
    SceneUpdateSchema,
    TokenUpdateSchema
]);

export type Update = t.TypeOf<typeof UpdateSchema>;

export function campaignUpdate(campaignID: string) {
    return `campaign/${campaignID}`;
}
