import { config } from "dotenv";
import { DatabaseProvider } from "../../src/storage/DatabaseProvider";
import { checkNotNull } from "../../src/util/Nullable";

export class DbFixture {
    provider: DatabaseProvider | null;

    constructor(dropCollection: string) {
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
                await db.dropCollection(dropCollection);
                await this.provider.close();
            }
        });
    }

    get() {
        return checkNotNull(this.provider);
    }
}
