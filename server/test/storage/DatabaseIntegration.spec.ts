import { BaseSchema } from "../../src/storage/BaseSchema";
import { BaseStore, Record, Results } from "../../src/storage/BaseStore";
import { Database } from "../../src/storage/Database";
import { Migrator } from "../../src/storage/Migrator";
import { Query } from "../../src/storage/Query";

const TestSchema = new (class extends BaseSchema {
    constructor() {
        super("test_schema");
    }

    id = this.stringField("id");
    name = this.stringField("name");

    primaryKey = this.id;
})();

class TestStore extends BaseStore {
    constructor(db: Database) {
        super(db, TestSchema);
    }
}

describe("DatabaseIntegration", () => {
    it("should work", async () => {
        const db = new Database(
            "localhost",
            5432,
            "postgres",
            "devpassword",
            "test"
        );
        const migrator = new Migrator(db);
        await migrator.migrate();
        const store = new TestStore(db);

        await store.create(
            Record.of([
                [TestSchema.id, "foo"],
                [TestSchema.name, "bar"],
            ])
        );
        expect(await store.find(new Query({ from: TestSchema }))).toEqual(
            new Results([
                Record.of([
                    [TestSchema.id, "foo"],
                    [TestSchema.name, "bar"],
                ]),
            ])
        );
    });
});
