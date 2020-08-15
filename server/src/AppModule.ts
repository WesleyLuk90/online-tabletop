import { Config } from "./Config";
import { Module } from "./Module";

export class AppModule extends Module {
    dbHost = Config.string("DB_HOST");
    dbPort = Config.number("DB_PORT");
    dbUser = Config.string("DB_USER");
    dbPass = Config.string("DB_PASS");

    async start() {}
}
