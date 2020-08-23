import { Server } from "http";
import { Implementation } from "./api/Implementation";
import { AuthModule } from "./auth/AuthModule";
import { Config } from "./Config";
import { createExpress } from "./http/Express";
import { lazy, Module } from "./Module";
import { Database } from "./storage/Database";
import { Migrator } from "./storage/Migrator";

export class AppModule extends Module {
    constructor(readonly config: Config) {
        super();
    }

    dbHost = this.config.string("DB_HOST");
    dbPort = this.config.number("DB_PORT");
    dbUser = this.config.string("DB_USER");
    dbPassword = this.config.string("DB_PASSWORD");
    dbSchema = this.config.string("DB_SCHEMA");
    httpPort = this.config.number("HTTP_PORT");
    httpHost = this.config.string("HTTP_HOST");

    db = lazy(
        () =>
            new Database(
                this.dbHost(),
                this.dbPort(),
                this.dbUser(),
                this.dbPassword(),
                this.dbSchema()
            )
    );
    migrator = lazy(() => new Migrator(this.db()));

    app = lazy(() => createExpress());
    http = lazy(() => new Server(this.app()));

    authModule = lazy(() => new AuthModule(this.config, this.db(), this.app()));

    api = lazy<Implementation<any, any>[]>(() => [
        ...this.authModule().api().implementations(),
    ]);

    async routeApi() {
        this.api().forEach((impl) => {
            this.app().post(`/api/${impl.api.name}`, (req, res) =>
                impl.handle(req, res)
            );
        });
    }

    async startServer() {
        return new Promise((res) =>
            this.http().listen(this.httpPort(), this.httpHost(), res)
        );
    }

    async stopServer() {
        return new Promise((res, rej) =>
            this.http().close((err) => {
                if (err) {
                    return rej(err);
                } else {
                    res();
                }
            })
        );
    }

    async start() {
        await this.migrator().migrate();
        await this.authModule().start();
        await this.routeApi();
        await this.startServer();
        console.log(`Listening on ${this.httpPort()}`);
    }
}
