import { BaseModel } from "../storage/BaseModel";
import { BaseSchema } from "../storage/BaseSchema";
import { BaseStore, Row } from "../storage/BaseStore";
import { Database } from "../storage/Database";

export class User extends BaseModel {
    constructor(readonly row: Row = new Row()) {
        super(row);
    }
}

const UserSchema = new (class extends BaseSchema {
    constructor() {
        super("user");
    }
})();

export class UserStorage extends BaseStore<User> {
    constructor(db: Database) {
        super(db, UserSchema, (r) => new User(r));
    }

    async create(user: User) {}
}
