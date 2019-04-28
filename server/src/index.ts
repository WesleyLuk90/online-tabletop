import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
require("dotenv").config();

const app = express();
const port = 3001;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        function(token, tokenSecret, profile, done) {
            console.log(token, tokenSecret, profile);
            done(null, { email: profile.email });
        }
    )
);

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
        failureRedirect: "/login",
        successRedirect: "/"
    })
);
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
