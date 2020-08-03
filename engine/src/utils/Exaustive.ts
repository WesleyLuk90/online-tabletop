export function assertExaustive(param: never) {
    throw new Error(`Unexpected value ${param}`);
}
