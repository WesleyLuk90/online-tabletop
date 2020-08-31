import { Collection, CollectionElement } from "../utils/Collection";

export interface Serde<S, T> {
    serialize(s: S): T;
    deserialize(t: T): S;
}

export function serializeCollection<S extends CollectionElement, T>(
    collection: Collection<S>,
    serde: Serde<S, T>
): T[] {
    return collection.all().map(serde.serialize);
}

export function deserializeCollection<T, S extends CollectionElement>(
    elements: T[],
    serde: Serde<S, T>
): Collection<S> {
    return Collection.ofList(elements.map(serde.deserialize));
}
