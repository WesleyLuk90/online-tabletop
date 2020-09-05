import { iots, uuid } from "engine";
import { BaseModel } from "server/src/storage/BaseModel";
import { BaseSchema } from "../../src/storage/BaseSchema";
import { BaseStore, Results, Row } from "../../src/storage/BaseStore";
import { Database } from "../../src/storage/Database";
import { Query, Where } from "../../src/storage/Query";
import { DatabaseFixture } from "./DatabaseFixture";

const JsonTypeSchema = iots.strict({
    list: iots.array(iots.string),
    value: iots.number,
});
interface JsonData extends iots.TypeOf<typeof JsonTypeSchema> {}

const TestSchema = new (class extends BaseSchema {
    constructor() {
        super("test_schema");
    }

    id = this.stringField("id");
    displayName = this.stringField("displayName");
    data = this.jsonField("json", JsonTypeSchema);

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

    setData(data: JsonData) {
        this.row.set(TestSchema.data, data);
        return this;
    }

    getData() {
        return this.row.get(TestSchema.data);
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
        const store = new TestStore(fixture.db());
        const data: JsonData = {
            list: ["a", "b"],
            value: 10,
        };

        const created = await store.create(
            new TestModel().setID("foo").setName("bar").setData(data)
        );
        expect(await store.find(new Query({ from: TestSchema }))).toEqual(
            new Results([
                new TestModel().setID("foo").setName("bar").setData(data),
            ])
        );
        expect(await store.findById(created.getID())).toEqual(
            new TestModel().setID("foo").setName("bar").setData(data)
        );
        expect(await store.findById("unknown")).toEqual(null);
    });

    it("should find using json", async () => {
        const store = new TestStore(fixture.db());
        const data1: JsonData = {
            list: ["a", "b"],
            value: 10,
        };
        const data2: JsonData = {
            list: ["a", "b"],
            value: 30,
        };

        await store.create(new TestModel().setID(uuid()).setData(data1));
        await store.create(new TestModel().setID(uuid()).setData(data2));
        const results = await store.find(
            new Query({
                from: TestSchema,
                where: Where.jsonContains(TestSchema.data, { value: 30 }),
            })
        );
        expect(results.results).toHaveLength(1);
        expect(results.results[0].getData()).toEqual(data2);
    });
});
