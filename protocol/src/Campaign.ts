import * as t from "io-ts";
import { RoleSchema } from "./Role";

export const PlayerSchema = t.type({
    userID: t.string,
    sceneID: t.string,
    role: RoleSchema
});

export type Player = t.TypeOf<typeof PlayerSchema>;

export const CampaignSchema = t.type({
    id: t.string,
    ownerID: t.string,
    players: t.array(PlayerSchema)
});

export type Campaign = t.TypeOf<typeof CampaignSchema>;
