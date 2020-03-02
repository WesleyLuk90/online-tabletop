import { config } from "dotenv";
import { DatabaseProvider } from "../../src/storage/DatabaseProvider";
import { MongoStorage } from "../../src/storage/MongoStorage";
import { checkNotNull } from "../../src/util/Nullable";

export class DbFixture<T extends MongoStorage<any>> {
    provider: DatabaseProvider | null;
    storage: T | null;

    constructor(readonly createStorage: (p: DatabaseProvider) => T) {
        beforeEach(() => {
            const conf = config({ path: ".env.test" });
            if (conf.error) {
                throw conf.error;
            }
            this.provider = new DatabaseProvider(
                checkNotNull(process.env.MONGO_HOST),
                checkNotNull(process.env.MONGO_DATABASE)
            );
        });
        afterEach(async () => {
            if (this.provider) {
                const db = await this.provider.get();
                if (this.storage != null) {
                    await db.dropCollection(this.storage.collectionName());
                }
                await this.provider.close();
            }
        });
    }

    async get() {
        this.storage = this.createStorage(checkNotNull(this.provider));
        await this.storage.initialize();
        return this.storage;
    }
}
