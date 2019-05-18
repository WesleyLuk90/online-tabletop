import * as t from "io-ts";

export const TokenValidator = t.type({
    id: t.string,
    x: t.number,
    y: t.number,
    width: t.number,
    height: t.number
});

export type Token = t.TypeOf<typeof TokenValidator>;
