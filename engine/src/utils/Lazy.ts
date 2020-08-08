export function lazy<T extends any>(create: () => T): () => T {
    let t: T | null = null;
    return () => {
        if (t == null) {
            t = create();
        }
        return t;
    };
}
