import * as t from "io-ts";
import { RoleSchema } from "./Role";

export const PlayerSchema = t.strict({
    userID: t.string,
    sceneID: t.string,
    role: RoleSchema
});

export type Player = t.TypeOf<typeof PlayerSchema>;

export const CampaignSchema = t.strict({
    id: t.string,
    ownerID: t.string,
    name: t.string,
    sceneID: t.string,
    players: t.array(PlayerSchema)
});

export type Campaign = t.TypeOf<typeof CampaignSchema>;
