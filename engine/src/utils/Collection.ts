import { fromNullable, Option } from "fp-ts/lib/Option";

interface Element {
    id: string;
}

export class Collection<T extends Element> {
    static empty<T extends Element>(): Collection<T> {
        return new Collection();
    }

    static of<T extends Element>(...elements: T[]): Collection<T> {
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

    get(id: string): Option<T> {
        return fromNullable(this.byId.get(id));
    }

    find(predicate: (t: T) => boolean): T | null {
        return Array.from(this.byId.values()).find(predicate) ?? null;
    }
}
