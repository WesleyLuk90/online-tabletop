export function lazy<T extends any>(create: () => T): () => T {
    let t: T | null = null;
    return () => {
        if (t == null) {
            t = create();
        }
        return t;
    };
}

export function ignoreEquality<T>(object: T, key: keyof T) {
    Object.defineProperty(object, key, {
        enumerable: false,
        value: object[key],
    });
}
