import { Api } from "../../../engine/src/api/Api";

export function implement<I, O>(
    api: Api<I, O>,
    func: (input: I) => Promise<O>
) {}
