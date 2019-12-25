import * as t from "io-ts";

export const SceneValidator = t.type({
    id: t.string,
    gameID: t.string,
    name: t.string
});

export type Scene = t.TypeOf<typeof SceneValidator>;
