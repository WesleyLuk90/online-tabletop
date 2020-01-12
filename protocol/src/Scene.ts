import * as t from "io-ts";
import { ColorSchema } from "./Color";

export const LayerSchema = t.strict({
    id: t.string,
    name: t.string,
    opacity: t.number,
    color: ColorSchema,
    playerVisible: t.boolean
});

export type Layer = t.TypeOf<typeof LayerSchema>;

export const SceneSchema = t.strict({
    sceneID: t.string,
    campaignID: t.string,
    name: t.string,
    layers: t.array(LayerSchema),
    gridSize: t.number
});

export type Scene = t.TypeOf<typeof SceneSchema>;
