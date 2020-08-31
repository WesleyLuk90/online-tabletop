import { fromNullable, Option } from "fp-ts/lib/Option";

export interface CollectionElement {
    id: string;
}

export class Collection<T extends CollectionElement> {
    static empty<T extends CollectionElement>(): Collection<T> {
        return new Collection();
    }

    static of<T extends CollectionElement>(...elements: T[]): Collection<T> {
        return Collection.ofList(elements);
    }

    static ofList<T extends CollectionElement>(elements: T[]): Collection<T> {
        const collection = new Collection<T>();
        elements.forEach((ele) => collection.byId.set(ele.id, ele));
        return collection;
    }

    private byId: Map<string, T> = new Map();

    private constructor() {}

    add(element: T): Collection<T> {
        const collection = new Collection<T>();
        collection.byId = new Map(this.byId);
        collection.byId.set(element.id, element);
        return collection;
    }

    addAll(collection: Collection<T>): Collection<T> {
        const newCollection = new Collection<T>();
        newCollection.byId = new Map(this.byId);
        collection.byId.forEach((v, k) => newCollection.byId.set(k, v));
        return newCollection;
    }

    all(): T[] {
        return Array.from(this.byId.values());
    }

    get(id: string): Option<T> {
        return fromNullable(this.byId.get(id));
    }

    find(predicate: (t: T) => boolean): T | null {
        return Array.from(this.byId.values()).find(predicate) ?? null;
    }
}
