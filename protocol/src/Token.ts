import * as t from "io-ts";

export const ColorSchema = t.type({
    red: t.number,
    green: t.number,
    blue: t.number,
    alpha: t.number
});

export const SquareTokenSchema = t.type({
    width: t.number,
    height: t.number,
    color: ColorSchema
});

export const EllipseSchema = t.type({
    width: t.number,
    height: t.number
});

export const TokenDataSchema = t.union([SquareTokenSchema, EllipseSchema]);

export const TokenSchema = t.type({
    id: t.string,
    sceneID: t.string,
    campaignID: t.string,
    x: t.number,
    y: t.number,
    data: TokenDataSchema
});

export type Token = t.TypeOf<typeof TokenSchema>;
