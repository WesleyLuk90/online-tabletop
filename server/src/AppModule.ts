import express from "express";
import { Server } from "http";
import { AuthModule } from "./auth/AuthModule";
import { Config } from "./Config";
import { lazy, Module } from "./Module";
import { Database } from "./storage/Database";

export class AppModule extends Module {
    dbHost = Config.string("DB_HOST");
    dbPort = Config.number("DB_PORT");
    dbUser = Config.string("DB_USER");
    dbPassword = Config.string("DB_PASSWORD");
    dbSchema = Config.string("DB_SCHEMA");
    httpPort = Config.number("HTTP_PORT");
    httpHost = Config.string("HTTP_HOST");

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

    app = lazy(() => express());
    http = lazy(() => new Server(this.app()));

    authModule = lazy(() => new AuthModule(this.db(), this.app()));

    async startServer() {
        return new Promise((res) =>
            this.http().listen(this.httpPort(), this.httpHost(), res)
        );
    }

    async start() {
        await this.authModule().start();
        await this.startServer();
        console.log(`Listening on ${this.httpPort()}`);
    }
}
