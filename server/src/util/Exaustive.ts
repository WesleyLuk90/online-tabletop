export function assertExhaustive(x: never): never {
    throw new Error(`Illegal state ${x}`);
}
