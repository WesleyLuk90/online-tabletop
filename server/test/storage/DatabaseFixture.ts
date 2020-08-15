import { uuid } from "engine/utils/Uuid";
import { Database } from "../../src/storage/Database";
import { Migrator } from "../../src/storage/Migrator";

export class DatabaseFixture {
    db = new Database(
        "localhost",
        5432,
        "postgres",
        "devpassword",
        "test" + uuid()
    );
    private migrator = new Migrator(this.db);

    constructor() {
        beforeAll(async () => {
            await this.migrator.migrate();
        });
        afterAll(async () => {
            await this.db.query(`DROP SCHEMA "${this.db.schema}" CASCADE`);
            await (await this.db.getClient()).end();
        });
    }
}
