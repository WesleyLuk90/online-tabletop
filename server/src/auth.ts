import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

export async function initializeAuth(
    clientID: string,
    clientSecret: string,
    callbackURL: string,
    app: express.Express
) {
    passport.use(
        new GoogleStrategy(
            {
                clientID,
                clientSecret,
                callbackURL
            },
            function(token, tokenSecret, profile, done) {
                done(null, { email: profile.email });
            }
        )
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
