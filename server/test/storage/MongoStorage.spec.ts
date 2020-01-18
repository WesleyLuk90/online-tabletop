import { newUUID } from "protocol/src/Id";
import { NotFoundError } from "../../src/Errors";
import { Field, MongoStorage } from "../../src/storage/MongoStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("MongoStorage", () => {
    class Data {
        constructor(readonly id: string, readonly other: string) {}
    }

    class TestCollection extends MongoStorage<Data> {
        static OtherField = new Field("other");

        collectionName() {
            return "mongo_storage";
        }
        parse(d: any) {
            return new Data(d._id, d.other);
        }
        id(d: Data) {
            return d.id;
        }

        fields() {
            return [TestCollection.OtherField];
        }
    }

    const db = new DbFixture(p => new TestCollection(p));

    it("get should return null", async () => {
        const s = await db.get();
        const id = newUUID();
        expect(await s.get(id)).toBe(null);
    });

    it("should create", async () => {
        const s = await db.get();
        const id = newUUID();
        const data = new Data(id, "b");
        await s.create(data);
        expect(await s.get(id)).toEqual(data);
    });

    it("should list", async () => {
        const a = newUUID();
        const b = newUUID();
        const s = await db.get();
        await s.create(new Data(a, "b"));
        await s.create(new Data(b, "b"));
        const list = (
            await s.list(TestCollection.OtherField.isEqualTo("b"))
        ).map(d => d.id);
        expect(list).toContain(a);
        expect(list).toContain(b);
    });

    it("should delete", async () => {
        const id = newUUID();
        const s = await db.get();
        const data = new Data(id, "b");
        await s.create(data);
        await s.delete(id);
        expect(await s.get(id)).toEqual(null);
    });

    it("should update", async () => {
        const s = await db.get();
        const id = newUUID();
        const data = new Data(id, "b");
        await s.create(data);
        await s.update(new Data(id, "c"));
        expect(await s.get(id)).toEqual(new Data(id, "c"));
    });

    it("should fail to update", async () => {
        const s = await db.get();
        const id = newUUID();
        const data = new Data(id, "b");
        await expect(s.update(data)).rejects.toBeInstanceOf(NotFoundError);
        await s.create(data);
        await s.update(data);
    });
});
