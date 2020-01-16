import * as t from "io-ts";
import { TokenDeltaSchema } from "./TokenDelta";

const CampaignUpdateSchema = t.strict({
    type: t.literal("campaign"),
    campaignID: t.string
});

export type CampaignUpdate = t.TypeOf<typeof CampaignUpdateSchema>;

const SceneUpdateSchema = t.strict({
    type: t.literal("scene"),
    campaignID: t.string,
    sceneID: t.string
});

export type SceneUpdate = t.TypeOf<typeof SceneUpdateSchema>;

const TokenUpdateSchema = t.strict({
    type: t.literal("token"),
    campaignID: t.string,
    sceneID: t.string,
    tokenID: t.string,
    fromVersion: t.number,
    update: TokenDeltaSchema
});

export type TokenUpdate = t.TypeOf<typeof TokenUpdateSchema>;

export const UpdateSchema = t.union([
    CampaignUpdateSchema,
    SceneUpdateSchema,
    TokenUpdateSchema
]);

export type Update = t.TypeOf<typeof UpdateSchema>;

export function campaignTopic(campaignID: string) {
    return `campaign/${campaignID}`;
}
