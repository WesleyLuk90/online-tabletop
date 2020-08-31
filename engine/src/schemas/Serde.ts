export abstract class Serde<S, T> {
    abstract serialize(s: S): T;
    abstract deserialize(t: T): S;
}
