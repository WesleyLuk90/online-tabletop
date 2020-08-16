import { BaseSchema } from "src/storage/BaseSchema";
import { Database } from "src/storage/Database";
import { BaseStore, Row } from "../storage/BaseStore";

export class User {
    constructor(readonly row: Row) {}
}

const UserSchema = new (class extends BaseSchema {
    constructor() {
        super("user");
    }
})();

export class UserStorage extends BaseStore {
    constructor(db: Database) {
        super(db, UserSchema);
    }

    async create(user: User) {}
}
