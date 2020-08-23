import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import { lazy } from "./Module";
import { checkNotNull } from "./util/Nullable";

export function fromEnv(): Config {
    let envPath = resolve(process.cwd(), ".env");
    if (!existsSync(envPath)) {
        envPath = resolve(process.cwd(), "../.env");
    }
    const c = config({ path: envPath });
    if (c.error) {
        throw c.error;
    }
    return Config.fromObject(checkNotNull(c.parsed));
}

export class Config {
    static fromObject(object: { [key: string]: string }) {
        const values = new Map<string, string>();
        Object.keys(object).forEach((key) => values.set(key, object[key]));
        return new Config(values);
    }

    static fromValues(values: [string, string][]) {
        return new Config(new Map(values));
    }

    constructor(readonly values: Map<string, string>) {}

    string(key: string): () => string {
        return lazy(() => this.readStringConfig(key));
    }

    number(key: string): () => number {
        return lazy(() => {
            const value = this.readStringConfig(key);

            const n = parseFloat(value);
            if (isNaN(n)) {
                throw Error(`Invalid config ${key} with value ${value}`);
            }
            return n;
        });
    }

    private readStringConfig(key: string) {
        return checkNotNull(
            this.values.get(key),
            `Missing configuration ${key}`
        );
    }
}
