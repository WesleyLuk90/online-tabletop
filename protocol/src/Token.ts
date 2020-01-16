import * as t from "io-ts";
import { ColorSchema } from "./Color";

export const SquareTokenSchema = t.strict({
    type: t.literal("square"),
    fillColor: ColorSchema,
    strokeColor: ColorSchema,
    strokeWidth: t.number
});

export const EllipseSchema = t.strict({
    type: t.literal("ellipse"),
    fillColor: ColorSchema,
    strokeColor: ColorSchema,
    strokeWidth: t.number
});

export const TokenDataSchema = t.union([SquareTokenSchema, EllipseSchema]);

export const RawTokenSchema = t.type({
    tokenID: t.string,
    sceneID: t.string,
    campaignID: t.string,
    layerID: t.string,
    revision: t.number,
    x: t.number,
    y: t.number,
    width: t.number,
    height: t.number,
    version: t.number,
    data: TokenDataSchema
});

export const TokenSchema = t.exact(RawTokenSchema);

export type Token = t.TypeOf<typeof TokenSchema>;
