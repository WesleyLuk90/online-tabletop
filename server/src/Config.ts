import { checkNotNull } from "./util/Nullable";

export enum ConfigKeys {
    AUTH0_CLIENT_ID = "AUTH0_CLIENT_ID",
    AUTH0_CLIENT_SECRET = "AUTH0_CLIENT_SECRET",
    AUTH0_CALLBACK_URL = "AUTH0_CALLBACK_URL",
    AUTH0_DOMAIN = "AUTH0_DOMAIN",
    SESSION_SECRET = "SESSION_SECRET",
    MONGO_HOST = "MONGO_HOST",
    MONGO_DATABASE = "MONGO_DATABASE",
    HTTP_PORT = "HTTP_PORT"
}

export function readConfig(key: ConfigKeys) {
    return checkNotNull(process.env[key], `Missing configuration ${key}`);
}

export function readConfigNumber(key: ConfigKeys) {
    const value = parseInt(readConfig(key), 10);
    if (isNaN(value)) {
        throw new Error(
            `Error reading config ${key}, expecting number but got ${readConfig(
                key
            )}`
        );
    }
    return value;
}
