import { BaseModel } from "../storage/BaseModel";
import { BaseSchema } from "../storage/BaseSchema";
import { BaseStore, Row } from "../storage/BaseStore";
import { Database } from "../storage/Database";

export const UserSchema = new (class extends BaseSchema {
    constructor() {
        super("users");
    }

    id = this.stringField("id");
    displayName = this.stringField("displayName");

    primaryKey = this.id;
})();

export class UserModel extends BaseModel {
    constructor(readonly row: Row = new Row()) {
        super(row);
    }

    setID(id: string): this {
        this.row.set(UserSchema.id, id);
        return this;
    }
    getID() {
        return this.row.get(UserSchema.id);
    }
    setName(name: string): this {
        this.row.set(UserSchema.displayName, name);
        return this;
    }
    getName() {
        return this.row.get(UserSchema.displayName);
    }
}

export class UserStorage extends BaseStore<UserModel> {
    constructor(db: Database) {
        super(db, UserSchema, (r) => new UserModel(r));
    }
}
