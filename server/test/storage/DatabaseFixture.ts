import { AppModule } from "server/src/AppModule";
import { formatQuery } from "../../src/storage/Database";
import { Migrator } from "../../src/storage/Migrator";
import { generateConfig } from "../TestConfig";

export class DatabaseFixture {
    module = new AppModule(generateConfig());
    private migrator = new Migrator(this.module.db());

    constructor() {
        beforeAll(async () => {
            await this.migrator.migrate();
        });
        afterAll(async () => {
            await this.db().query(
                formatQuery("DROP SCHEMA %I CASCADE", this.module.dbSchema())
            );
            await (await this.db().getClient()).end();
        });
    }

    db() {
        return this.module.db();
    }
}
