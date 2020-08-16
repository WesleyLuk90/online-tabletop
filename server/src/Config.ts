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

export class Config {
    static string(key: string): () => string {
        return lazy(() => Config.readString(key));
    }

    static number(key: string): () => number {
        return lazy(() => {
            const value = Config.readString(key);

            const n = parseFloat(value);
            if (isNaN(n)) {
                throw Error(`Invalid config ${key} with value ${value}`);
            }
            return n;
        });
    }

    private static readString(key: string) {
        return checkNotNull(env()[key], `Missing configuration ${key}`);
    }
}
