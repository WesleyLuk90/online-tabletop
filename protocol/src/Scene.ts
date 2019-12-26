import * as t from "io-ts";

export const SceneSchema = t.type({
    id: t.string,
    gameID: t.string,
    name: t.string
});

export type Scene = t.TypeOf<typeof SceneSchema>;
