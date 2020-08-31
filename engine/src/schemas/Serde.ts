export interface Serde<S, T> {
    serialize(s: S): T;
    deserialize(t: T): S;
}
