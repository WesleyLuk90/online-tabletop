import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

export function parse<T extends {}, D>(data: T, schema: t.Type<D>): D {
    const result = schema.decode(data);
    return result.fold(
        e => {
            throw new Error(PathReporter.report(result).join("\n"));
        },
        r => r
    );
}
