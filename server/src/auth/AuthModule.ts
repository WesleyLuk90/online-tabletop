import { Express } from "express";
import { Config } from "../Config";
import { lazy, Module } from "../Module";
import { initializeSession } from "../Session";
import { Database } from "../storage/Database";
import { initializeAuth } from "./Auth";
import { UserStorage } from "./UserStorage";

export class AuthModule extends Module {
    constructor(readonly db: Database, readonly app: Express) {
        super();
    }

    auth0ClientID = Config.string("AUTH0_CLIENT_ID");
    auth0ClientSecret = Config.string("AUTH0_CLIENT_SECRET");
    auth0CallbackUrl = Config.string("AUTH0_CALLBACK_URL");
    auth0Domain = Config.string("AUTH0_DOMAIN");

    sessionSecret = Config.string("SESSION_SECRET");

    userStorage = lazy(() => new UserStorage(this.db));

    api = lazy(() => {
        // new UserImpl();
    });

    async initializeSession() {
        return initializeSession(this.sessionSecret(), this.app);
    }

    async initializeAuth() {
        return initializeAuth(
            {
                clientID: this.auth0ClientID(),
                clientSecret: this.auth0ClientSecret(),
                callbackURL: this.auth0CallbackUrl(),
                domain: this.auth0Domain(),
            },
            this.app,
            this.userStorage()
        );
    }

    async start() {
        await this.initializeSession();
        await this.initializeAuth();
    }
}
