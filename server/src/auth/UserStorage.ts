import { BaseModel } from "../storage/BaseModel";
import { BaseSchema } from "../storage/BaseSchema";
import { BaseStore, Row } from "../storage/BaseStore";
import { Database } from "../storage/Database";

const UserSchema = new (class extends BaseSchema {
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

    @BaseModel.setter(UserSchema.id)
    setID: (id: string) => this;
    @BaseModel.setter(UserSchema.displayName)
    setName: (name: string) => this;
}

export class UserStorage extends BaseStore<UserModel> {
    constructor(db: Database) {
        super(db, UserSchema, (r) => new UserModel(r));
    }
}
