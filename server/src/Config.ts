import { checkNotNull } from "./util/Nullable";

export enum ConfigKeys {
    GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID",
    GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET",
    GOOGLE_CALLBACK_URL = "GOOGLE_CALLBACK_URL",
    SESSION_SECRET = "SESSION_SECRET",
    MONGO_HOST = "MONGO_HOST",
    MONGO_DATABASE = "MONGO_DATABASE"
}

export function readConfig(key: ConfigKeys) {
    return checkNotNull(process.env[key], `Missing configuration ${key}`);
}
