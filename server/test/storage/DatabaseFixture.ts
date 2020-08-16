import { uuid } from "engine/utils/Uuid";
import { AppModule } from "server/src/AppModule";
import { Database } from "../../src/storage/Database";
import { Migrator } from "../../src/storage/Migrator";

export class DatabaseFixture {
    module = new AppModule();
    db = new Database(
        this.module.dbHost(),
        this.module.dbPort(),
        this.module.dbUser(),
        this.module.dbPass(),
        this.module.dbSchema() + uuid()
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
