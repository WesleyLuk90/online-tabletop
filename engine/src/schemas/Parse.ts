import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";

export function parse<I, T extends t.Props>(
    data: any,
    schema: t.Decoder<I, T>
): T {
    return pipe(
        schema.decode(data),
        fold(
            (e) => {
                throw e;
            },
            (r) => r
        )
    );
}
