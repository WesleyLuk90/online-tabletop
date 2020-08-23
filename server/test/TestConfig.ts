import { uuid } from "engine";
import { Config } from "../src/Config";

function randomPort() {
    return 10000 + Math.floor(Math.random() * 1000);
}

export function generateConfig() {
    return Config.fromValues([
        ["AUTH0_CLIENT_ID", ""],
        ["AUTH0_CLIENT_SECRET", ""],
        ["AUTH0_CALLBACK_URL", "http://localhost:3000/callback"],
        ["AUTH0_DOMAIN", "online-tabletop.auth0.com"],
        ["SESSION_SECRET", ""],
        ["DB_HOST", "localhost"],
        ["DB_PORT", "5432"],
        ["DB_USER", "postgres"],
        ["DB_PASSWORD", "devpassword"],
        ["DB_SCHEMA", `test-${uuid()}`],
        ["HTTP_PORT", randomPort().toString()],
        ["HTTP_HOST", "127.0.0.1"],
    ]);
}
