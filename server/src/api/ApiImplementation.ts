import { Api } from "engine";

export function implement<I, O>(
    api: Api<I, O>,
    func: (input: I) => Promise<O>
) {}
