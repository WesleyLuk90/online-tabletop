import * as t from "io-ts";

export enum Role {
    player = "player",
    manager = "manager"
}

export const RoleSchema = t.keyof({
    [Role.player]: null,
    [Role.manager]: null
});
