import express from "express";
import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";

export async function initializeAuth(
    clientID: string,
    clientSecret: string,
    callbackURL: string,
    app: express.Express
) {
    passport.use(
        new Auth0Strategy({}, function(token, tokenSecret, profile, done) {
            done(null, { email: profile.email });
        })
    );

    passport.serializeUser(function(user: { email: string }, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        done(null, { email });
    });

    app.use(passport.initialize());
    app.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: "openid email"
        })
    );
    app.get(
        "/auth/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/#/login?failed",
            successRedirect: "/"
        })
    );
}
