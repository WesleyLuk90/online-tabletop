import * as t from "io-ts";

export const ColorSchema = t.strict({
    red: t.number,
    green: t.number,
    blue: t.number,
    alpha: t.number
});

export type ColorData = t.TypeOf<typeof ColorSchema>;
