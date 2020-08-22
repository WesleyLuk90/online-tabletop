import * as t from "io-ts";

export class Api<I, O> {
    constructor(
        readonly method: string,
        readonly input: t.Type<I>,
        readonly output: t.Type<O>
    ) {}
}
