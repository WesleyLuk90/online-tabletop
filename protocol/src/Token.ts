import * as t from "io-ts";

export const TokenValidator = t.type({
    _id: t.string,
    sceneID: t.string,
    gameID: t.string,
    x: t.number,
    y: t.number,
    width: t.number,
    height: t.number
});

export type Token = t.TypeOf<typeof TokenValidator>;
