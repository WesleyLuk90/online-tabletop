import { Api, Engine } from "engine";

new Engine();

export function implement<I, O>(
    api: Api<I, O>,
    func: (input: I) => Promise<O>
) {}
