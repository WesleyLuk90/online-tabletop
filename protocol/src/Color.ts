import * as t from "io-ts";
export const ColorSchema = t.type({
    red: t.number,
    green: t.number,
    blue: t.number,
    alpha: t.number
});
