import * as t from "io-ts";

export enum Role {
    player = "player",
    manager = "manager"
}

export const RoleSchema = t.union([t.literal(Role.player), t.literal(Role.manager)])