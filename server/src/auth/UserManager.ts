import { User } from "protocol/src/User";
import { Route } from "../Route";
import { UserStorage } from "./UserStorage";

export class UserManager {
    constructor(readonly userStorage: UserStorage) {}

    routes(): Route[] {
        return [
            Route.create("get", "/api/user/me", userID => this.profile(userID))
        ];
    }

    profile(userID: string): Promise<User> {
        return this.userStorage.get(userID);
    }
}
