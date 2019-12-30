import { User } from "protocol/src/User";
import { Route } from "../Route";
import { UserStorage } from "./UserStorage";

export class UserManager {
    constructor(readonly userStorage: UserStorage) {}

    routes(): Route[] {
        return [
            Route.createPublic("get", "/api/user/me", userID =>
                this.profile(userID)
            )
        ];
    }

    async profile(userID: string | null): Promise<User | null> {
        if (userID == null) {
            return null;
        }
        return this.userStorage.get(userID);
    }
}
