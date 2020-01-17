import * as t from "io-ts";
import { RawTokenSchema, TokenSchema } from "./Token";

export const CreateTokenSchema = t.strict({
    type: t.literal("create"),
    token: TokenSchema
});

export type CreateToken = t.TypeOf<typeof CreateTokenSchema>;

export const UpdateTokenSchema = t.strict({
    type: t.literal("update"),
    campaignID: t.string,
    tokenID: t.string,
    update: t.partial(RawTokenSchema.props)
});

export type UpdateToken = t.TypeOf<typeof UpdateTokenSchema>;

export const DeleteTokenSchema = t.strict({
    type: t.literal("delete"),
    campaignID: t.string,
    tokenID: t.string
});

export type DeleteToken = t.TypeOf<typeof DeleteTokenSchema>;

export const TokenDeltaSchema = t.union([
    CreateTokenSchema,
    UpdateTokenSchema,
    DeleteTokenSchema
]);

export type TokenDelta = t.TypeOf<typeof TokenDeltaSchema>;

export function getCampaignID(tokenDelta: TokenDelta): string {
    switch (tokenDelta.type) {
        case "create":
            return tokenDelta.token.campaignID;
        case "update":
            return tokenDelta.campaignID;
        case "delete":
            return tokenDelta.campaignID;
    }
}
