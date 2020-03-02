import * as t from "io-ts";
import { RawTokenSchema, Token, TokenSchema } from "./Token";

export const CreateTokenSchema = t.strict({
    type: t.literal("create"),
    token: TokenSchema,
    source: t.string
});

export interface CreateToken extends t.TypeOf<typeof CreateTokenSchema> {}

export const UpdateTokenSchema = t.strict({
    type: t.literal("update"),
    campaignID: t.string,
    tokenID: t.string,
    update: t.partial(RawTokenSchema.props),
    source: t.string
});

export interface UpdateToken extends t.TypeOf<typeof UpdateTokenSchema> {}

export function applyUpdateToken(token: Token, update: UpdateToken): Token {
    return { ...token, ...update.update };
}

export const DeleteTokenSchema = t.strict({
    type: t.literal("delete"),
    campaignID: t.string,
    tokenID: t.string,
    source: t.string
});

export interface DeleteToken extends t.TypeOf<typeof DeleteTokenSchema> {}

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
