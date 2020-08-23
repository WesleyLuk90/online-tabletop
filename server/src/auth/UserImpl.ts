import { GetCurrentUser, UserData } from "engine";
import { Context } from "../api/Context";
import { Implementation } from "../api/Implementation";
import { Implementations } from "../api/Implementations";
import { UserStorage } from "./UserStorage";

export class UserImpl implements Implementations {
    constructor(readonly userStore: UserStorage) {}

    implementations() {
        return [
            new Implementation(GetCurrentUser, (ctx) =>
                this.getCurrentUser(ctx)
            ),
        ];
    }

    async getCurrentUser(ctx: Context): Promise<UserData | null> {
        if (ctx.userID == null) {
            return null;
        }
        const user = await this.userStore.findById(ctx.userID);
        if (user == null) {
            throw Error(`Missing user with id ${ctx.userID}`);
        }
        return {
            displayName: user.getName(),
            id: user.getID(),
        };
    }
}
