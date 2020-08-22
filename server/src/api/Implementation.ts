import { Api } from "engine";
import { Context } from "./Context";

export class Implementation<I, O> {
    constructor(
        readonly api: Api<I, O>,
        readonly implementation: (context: Context, input: I) => Promise<O>
    ) {}
}
