export class Serde<S, T> {
    constructor(
        readonly serialize: (s: S) => T,
        readonly deserialize: (t: T) => S
    ) {}
}
