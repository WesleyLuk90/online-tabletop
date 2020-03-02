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

export interface CampaignUpdate extends t.TypeOf<typeof CampaignUpdateSchema> {}

const SceneUpdateSchema = t.strict({
    type: t.literal("scene"),
    campaignID: t.string,
    sceneID: t.string
});

export interface SceneUpdate extends t.TypeOf<typeof SceneUpdateSchema> {}

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

export interface TokenUpdate extends t.TypeOf<typeof TokenUpdateSchema> {}

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
export interface EntityUpdate extends t.TypeOf<typeof EntityUpdateSchema> {}

export const UpdateSchema: t.UnionC<[
    t.Type<CampaignUpdate>,
    t.Type<SceneUpdate>,
    t.Type<TokenUpdate>,
    t.Type<EntityUpdate>
]> = t.union([
    CampaignUpdateSchema,
    SceneUpdateSchema,
    TokenUpdateSchema,
    EntityUpdateSchema
]);

export type Update = t.TypeOf<typeof UpdateSchema>;

export function campaignTopic(campaignID: string) {
    return `campaign/${campaignID}`;
}
