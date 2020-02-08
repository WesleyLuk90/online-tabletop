import * as t from "io-ts";
import { ColorSchema } from "./Color";

export const ShapeToken = t.strict({
    type: t.keyof({
        square: null,
        ellipse: null
    }),
    fillColor: ColorSchema,
    strokeColor: ColorSchema,
    strokeWidth: t.number
});

export const TokenDataSchema = ShapeToken;

export const RawTokenSchema = t.type({
    tokenID: t.string,
    sceneID: t.string,
    campaignID: t.string,
    layerID: t.string,
    x: t.number,
    y: t.number,
    width: t.number,
    height: t.number,
    version: t.number,
    data: TokenDataSchema
});

export const TokenSchema = t.exact(RawTokenSchema);

export type Token = t.TypeOf<typeof TokenSchema>;
