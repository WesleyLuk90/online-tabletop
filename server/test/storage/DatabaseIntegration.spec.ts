import { BaseModel } from "server/src/storage/BaseModel";
import { BaseSchema } from "../../src/storage/BaseSchema";
import { BaseStore, Results, Row } from "../../src/storage/BaseStore";
import { Database } from "../../src/storage/Database";
import { Query } from "../../src/storage/Query";
import { DatabaseFixture } from "./DatabaseFixture";

const TestSchema = new (class extends BaseSchema {
    constructor() {
        super("test_schema");
    }

    id = this.stringField("id");
    displayName = this.stringField("displayName");

    primaryKey = this.id;
})();

class TestModel extends BaseModel {
    constructor(row: Row = new Row()) {
        super(row);
    }

    setID(s: string) {
        this.row.set(TestSchema.id, s);
        return this;
    }

    getID() {
        return this.row.get(TestSchema.id);
    }

    setName(s: string) {
        this.row.set(TestSchema.id, s);
        return this;
    }
}

class TestStore extends BaseStore<TestModel> {
    constructor(db: Database) {
        super(db, TestSchema, (r) => new TestModel(r));
    }
}

describe("DatabaseIntegration", () => {
    const fixture = new DatabaseFixture();

    it("should create and find", async () => {
        const store = new TestStore(fixture.db);

        const created = await store.create(
            new TestModel().setID("foo").setName("bar")
        );
        expect(await store.find(new Query({ from: TestSchema }))).toEqual(
            new Results([new TestModel().setID("foo").setName("bar")])
        );
        expect(await store.findById(created.getID())).toEqual(
            new TestModel().setID("foo").setName("bar")
        );
        expect(await store.findById("unknown")).toEqual(null);
    });
});
