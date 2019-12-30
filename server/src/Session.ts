import express from "express";
import session from "express-session";
import SessionFileStore from "session-file-store";

const Store = SessionFileStore(session);

export async function initializeSession(secret: string, app: express.Express) {
    app.use(
        session({
            secret: secret,
            resave: false,
            saveUninitialized: false,
            store: new Store({ ttl: 60 * 60 * 24 * 7 }),
            cookie: {
                secure: app.get("env") === "production"
            }
        })
    );
}
