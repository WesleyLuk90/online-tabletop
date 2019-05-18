import * as t from "io-ts";
import { SceneValidator } from "./Scene";

export const CampaignValidator = t.type({
    id: t.string,
    scene: t.string,
    scenes: t.array(SceneValidator)
});

export type Campaign = t.TypeOf<typeof CampaignValidator>;
