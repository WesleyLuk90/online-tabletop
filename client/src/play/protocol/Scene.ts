import * as t from "io-ts";
import { TokenValidator } from "./Token";

export const SceneValidator = t.type({
    id: t.string,
    name: t.string,
    tokens: t.array(TokenValidator)
});

export type Scene = t.TypeOf<typeof SceneValidator>;
