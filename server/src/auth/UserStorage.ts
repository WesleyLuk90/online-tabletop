import { parse } from "protocol/src/Parse";
import { User, UserSchema } from "protocol/src/User";
import { Document, MongoStorage } from "../storage/MongoStorage";
import { checkNotNull } from "../util/Nullable";

export class UserCollection extends MongoStorage<User> {
    collectionName() {
        return "users";
    }

    parse(data: Document) {
        return parse(data, UserSchema);
    }

    id(user: User) {
        return user.id;
    }
}

export class UserStorage {
    constructor(readonly collection: UserCollection) {}

    async get(id: string): Promise<User> {
        return checkNotNull(
            await this.collection.get(id),
            `User not found ${id}`
        );
    }

    async create(user: User) {
        if ((await this.collection.get(user.id)) == null) {
            await this.collection.create(user);
        }
    }
}
