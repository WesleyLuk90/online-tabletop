import * as t from "io-ts";
import {
    CreateEntityDeltaSchema,
    DeleteEntityDeltaSchema,
    UpdateEntityDeltaSchema
} from "./EntityDelta";
import {
    CreateTokenSchema,
    DeleteTokenSchema,
    UpdateTokenSchema
} from "./TokenDelta";

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
    update: t.union([
        CreateTokenSchema,
        DeleteTokenSchema,
        t.intersection([
            t.strict({
                fromVersion: t.number
            }),
            UpdateTokenSchema
        ])
    ])
});

export type TokenUpdate = t.TypeOf<typeof TokenUpdateSchema>;

const EntityUpdateSchema = t.strict({
    type: t.literal("entity"),
    campaignID: t.string,
    update: t.union([
        CreateEntityDeltaSchema,
        DeleteEntityDeltaSchema,
        t.intersection([
            t.strict({
                fromVersion: t.number
            }),
            UpdateEntityDeltaSchema
        ])
    ])
});

export const UpdateSchema = t.union([
    CampaignUpdateSchema,
    SceneUpdateSchema,
    TokenUpdateSchema,
    EntityUpdateSchema
]);

export type Update = t.TypeOf<typeof UpdateSchema>;

export function campaignTopic(campaignID: string) {
    return `campaign/${campaignID}`;
}
