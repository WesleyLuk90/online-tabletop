import { checkNotNull } from "./util/Nullable";

export enum ConfigKeys {
    AUTH0_CLIENT_ID = "AUTH0_CLIENT_ID",
    AUTH0_CLIENT_SECRET = "AUTH0_CLIENT_SECRET",
    SESSION_SECRET = "SESSION_SECRET",
    MONGO_HOST = "MONGO_HOST",
    MONGO_DATABASE = "MONGO_DATABASE"
}

export function readConfig(key: ConfigKeys) {
    return checkNotNull(process.env[key], `Missing configuration ${key}`);
}
