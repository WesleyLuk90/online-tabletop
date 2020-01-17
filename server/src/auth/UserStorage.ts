import { parse } from "protocol/src/Parse";
import { User, UserSchema } from "protocol/src/User";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";
import { checkNotNull } from "../util/Nullable";

export class UserStorage {
    storage: MongoStorage<User, keyof User>;
    constructor(readonly dbProvider: DatabaseProvider) {
        this.storage = new MongoStorage(
            dbProvider,
            "users",
            d => parse(d, UserSchema),
            u => u.id,
            []
        );
    }

    async get(id: string): Promise<User> {
        return checkNotNull(await this.storage.get(id), `User not found ${id}`);
    }

    async create(user: User) {
        if ((await this.storage.get(user.id)) == null) {
            await this.storage.create(user);
        }
    }
}
