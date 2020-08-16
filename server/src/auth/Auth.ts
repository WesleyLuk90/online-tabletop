import express from "express";
import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";
import { UserModel, UserStorage } from "./UserStorage";

export async function initializeAuth(
    config: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        domain: string;
    },
    app: express.Express,
    userStorage: UserStorage
) {
    passport.use(
        new Auth0Strategy(config, function (
            token,
            tokenSecret,
            extra,
            profile,
            done
        ) {
            userStorage
                .create(
                    new UserModel()
                        .setID(profile.id)
                        .setName(profile.displayName)
                )
                .then(() => done(null, { userID: profile.id }), done);
        })
    );

    passport.serializeUser(function (user: { userID: string }, done) {
        done(null, user.userID);
    });

    passport.deserializeUser(function (userID, done) {
        done(null, { userID });
    });

    app.use(passport.initialize());
    app.use(passport.session());
    app.get(
        "/login",
        passport.authenticate("auth0", {
            scope: "openid email profile",
        }),
        function (req, res) {
            res.redirect("/");
        }
    );
    app.get("/user", function (req, res) {
        res.json({
            user: req.user,
        });
    });
    app.get("/callback", (req, res, next) => {
        passport.authenticate("auth0", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        })(req, res, next);
    });
}
