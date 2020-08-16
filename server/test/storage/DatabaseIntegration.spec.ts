import { BaseModel } from "src/storage/BaseModel";
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
    name = this.stringField("name");

    primaryKey = this.id;
})();

class TestModel extends BaseModel {
    constructor(row: Row = new Row()) {
        super(row);
    }
}

class TestStore extends BaseStore<TestModel> {
    constructor(db: Database) {
        super(db, TestSchema, (r) => new TestModel(r));
    }
}

describe("DatabaseIntegration", () => {
    const fixture = new DatabaseFixture();
    it("should work", async () => {
        const store = new TestStore(fixture.db);

        await store.create(
            Row.of([
                [TestSchema.id, "foo"],
                [TestSchema.name, "bar"],
            ])
        );
        expect(await store.find(new Query({ from: TestSchema }))).toEqual(
            new Results([
                Row.of([
                    [TestSchema.id, "foo"],
                    [TestSchema.name, "bar"],
                ]),
            ])
        );
    });
});
