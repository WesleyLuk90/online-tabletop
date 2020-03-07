import * as t from "io-ts";
import { Role, RoleSchema } from "./Role";

export const PlayerSchema = t.strict({
    userID: t.string,
    sceneID: t.string,
    role: RoleSchema
});

export interface Player extends t.TypeOf<typeof PlayerSchema> {
    role: Role;
}

export const CampaignSchema = t.strict({
    id: t.string,
    ownerID: t.string,
    name: t.string,
    sceneID: t.string,
    players: t.array(PlayerSchema)
});

export interface Campaign extends t.TypeOf<typeof CampaignSchema> {}
