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
        collection.byId = new Map(collection.byId);
        collection.byId.set(element.id, element);
        return collection;
    }
}
