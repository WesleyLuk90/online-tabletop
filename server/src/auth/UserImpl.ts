import { GetCurrentUser } from "engine";
import { Context } from "../api/Context";
import { Implementation } from "../api/Implementation";
import { Implementations } from "../api/Implementations";
import { UserStorage } from "./UserStorage";

export class UserImpl extends Implementations {
    constructor(readonly userStore: UserStorage) {
        super([new Implementation(GetCurrentUser, async (ctx) => ctx.user)]);
    }

    async getCurrentUser(ctx: Context) {}
}
