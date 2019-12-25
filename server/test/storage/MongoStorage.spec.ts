import { config } from "dotenv";
import { DatabaseProvider } from "../../src/storage/DatabaseProvider";
import { MongoStorage } from "../../src/storage/MongoStorage";
import { checkNotNull } from "../../src/util/Nullable";

describe("MongoStorage", () => {
    class Data {
        constructor(readonly id: string, readonly other: string) {}
    }

    let provider: DatabaseProvider | null;
    afterEach(async () => {
        if (provider) {
            await provider.close();
        }
    });

    async function storage() {
        const conf = config({ path: ".env.test" });
        if (conf.error) {
            throw conf.error;
        }
        provider = new DatabaseProvider(
            checkNotNull(process.env.MONGO_HOST),
            checkNotNull(process.env.MONGO_DATABASE)
        );
        const storage = new MongoStorage(
            provider,
            "mongo_storage",
            (d: any) => new Data(d._id, d.other),
            d => d.id
        );
        const collection = await storage.collection();
        await collection.deleteMany({});
        return storage;
    }

    it("get should return null", async () => {
        const s = await storage();
        expect(await s.get("a")).toBe(null);
    });

    it("should create", async () => {
        const s = await storage();
        const data = new Data("a", "b");
        await s.create(data);
        expect(await s.get("a")).toEqual(data);
    });

    it("should list", async () => {
        const s = await storage();
        await s.create(new Data("a", "b"));
        await s.create(new Data("b", "b"));
        expect(await s.list({ key: "other", value: "b" })).toHaveLength(2);
    });

    it("should delete", async () => {
        const s = await storage();
        const data = new Data("a", "b");
        await s.create(data);
        await s.delete("a");
        expect(await s.get("a")).toEqual(null);
    });

    it("should update", async () => {
        const s = await storage();
        const data = new Data("a", "b");
        await s.create(data);
        await s.update(new Data("a", "c"));
        expect(await s.get("a")).toEqual(new Data("a", "c"));
    });
});
