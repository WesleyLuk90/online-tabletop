import { debug } from "./Debug";

export function assertExaustive(param: never): never {
    throw new Error(`Unexpected value ${debug(param)}`);
}
