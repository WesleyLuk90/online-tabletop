import { uuid } from "engine/utils/Uuid";
import { AppModule } from "server/src/AppModule";
import { Database, formatQuery } from "../../src/storage/Database";
import { Migrator } from "../../src/storage/Migrator";

export class DatabaseFixture {
    module = new AppModule();
    schema = this.module.dbSchema() + uuid();
    db = new Database(
        this.module.dbHost(),
        this.module.dbPort(),
        this.module.dbUser(),
        this.module.dbPassword(),
        this.schema
    );
    private migrator = new Migrator(this.db);

    constructor() {
        beforeAll(async () => {
            await this.migrator.migrate();
        });
        afterAll(async () => {
            await this.db.query(
                formatQuery("DROP SCHEMA %I CASCADE", this.schema)
            );
            await (await this.db.getClient()).end();
        });
    }
}
