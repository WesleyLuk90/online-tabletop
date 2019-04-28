import express from "express";
import session from "express-session";

export async function initializeSession(app: express.Express) {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        })
    );
}
