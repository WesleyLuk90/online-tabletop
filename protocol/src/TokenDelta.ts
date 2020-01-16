import * as t from "io-ts";
import { RawTokenSchema, TokenSchema } from "./Token";

export const CreateTokenSchema = t.strict({
    type: t.literal("create"),
    token: TokenSchema
});

export const UpdateTokenSchema = t.strict({
    type: t.literal("update"),
    update: t.partial(RawTokenSchema.props)
});

export const DeleteTokenSchema = t.strict({
    type: t.literal("delete"),
    tokenID: t.string
});

export const TokenDeltaSchema = t.union([
    CreateTokenSchema,
    UpdateTokenSchema,
    DeleteTokenSchema
]);

export const TokenUpdateRequestSchema = t.strict({
    campaignID: t.string,
    tokenID: t.string,
    update: TokenDeltaSchema
});

export type TokenUpdateRequest = t.TypeOf<typeof TokenUpdateRequestSchema>;
