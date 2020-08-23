import { Express } from "express";
import { Config } from "../Config";
import { initializeSession } from "../http/Session";
import { lazy, Module } from "../Module";
import { Database } from "../storage/Database";
import { initializeAuth } from "./Auth";
import { UserImpl } from "./UserImpl";
import { UserStorage } from "./UserStorage";

export class AuthModule extends Module {
    constructor(
        readonly config: Config,
        readonly db: Database,
        readonly app: Express
    ) {
        super();
    }

    auth0ClientID = this.config.string("AUTH0_CLIENT_ID");
    auth0ClientSecret = this.config.string("AUTH0_CLIENT_SECRET");
    auth0CallbackUrl = this.config.string("AUTH0_CALLBACK_URL");
    auth0Domain = this.config.string("AUTH0_DOMAIN");

    sessionSecret = this.config.string("SESSION_SECRET");

    userStorage = lazy(() => new UserStorage(this.db));

    api = lazy(() => new UserImpl(this.userStorage()));

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
