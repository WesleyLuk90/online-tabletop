import express from "express";
import { Server } from "http";
import { initializeAuth } from "./auth/Auth";
import { Config } from "./Config";
import { lazy, Module } from "./Module";
import { initializeSession } from "./Session";

export class AppModule extends Module {
    dbHost = Config.string("DB_HOST");
    dbPort = Config.number("DB_PORT");
    dbUser = Config.string("DB_USER");
    dbPass = Config.string("DB_PASSWORD");
    dbSchema = Config.string("DB_SCHEMA");
    httpPort = Config.number("HTTP_PORT");
    httpHost = Config.string("HTTP_HOST");

    auth0ClientID = Config.string("AUTH0_CLIENT_ID");
    auth0ClientSecret = Config.string("AUTH0_CLIENT_SECRET");
    auth0CallbackUrl = Config.string("AUTH0_CALLBACK_URL");
    auth0Domain = Config.string("AUTH0_DOMAIN");

    sessionSecret = Config.string("SESSION_SECRET");

    app = lazy(() => express());
    http = lazy(() => new Server(this.app()));

    async initializeSession() {
        return initializeSession(this.sessionSecret(), this.app());
    }

    async initializeAuth() {
        return initializeAuth(
            {
                clientID: this.auth0ClientID(),
                clientSecret: this.auth0ClientSecret(),
                callbackURL: this.auth0CallbackUrl(),
                domain: this.auth0Domain(),
            },
            this.app(),
            null as any
        );
    }
    async startServer() {
        return new Promise((res) =>
            this.http().listen(this.httpPort(), this.httpHost(), res)
        );
    }

    async start() {
        await this.initializeSession();
        await this.initializeAuth();
        await this.startServer();
        console.log(`Listening on ${this.httpPort()}`);
    }
}
