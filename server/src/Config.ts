import { config } from "dotenv";
import { lazy } from "./Module";
import { checkNotNull } from "./util/Nullable";

const env = lazy(() => {
    const c = config();
    if (c.error) {
        throw c.error;
    }
    return checkNotNull(c.parsed);
});

export enum ConfigKeys {
    AUTH0_CLIENT_ID = "AUTH0_CLIENT_ID",
    AUTH0_CLIENT_SECRET = "AUTH0_CLIENT_SECRET",
    AUTH0_CALLBACK_URL = "AUTH0_CALLBACK_URL",
    AUTH0_DOMAIN = "AUTH0_DOMAIN",
    SESSION_SECRET = "SESSION_SECRET",
    MONGO_HOST = "MONGO_HOST",
    MONGO_DATABASE = "MONGO_DATABASE",
    HTTP_PORT = "HTTP_PORT",
}

export class Config<T> {
    static string(key: string): Config<string> {
        return new Config(key, (s) => s);
    }

    static number(key: string): Config<number> {
        return new Config(key, (s) => {
            const n = parseFloat(s);
            if (isNaN(n)) {
                throw Error(`Invalid config ${key} with value ${s}`);
            }
            return n;
        });
    }

    constructor(readonly key: string, readonly parse: (s: string) => T) {}

    get = lazy(() => this.parse(checkNotNull(env()[this.key])));
}
