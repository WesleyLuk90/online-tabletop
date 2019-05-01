import express from "express";
import session from "express-session";
import SessionFileStore from "session-file-store";

const Store = SessionFileStore(session);

export async function initializeSession(app: express.Express) {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new Store({ ttl: 60 * 60 * 24 * 7 })
        })
    );
}
