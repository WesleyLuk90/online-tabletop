import { debug } from "./Debug";

export function assertExaustive(param: never) {
    throw new Error(`Unexpected value ${debug(param)}`);
}
