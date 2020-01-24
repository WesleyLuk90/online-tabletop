export function groupBy<T, K>(t: T[], key: (t: T) => K): Map<K, T[]> {
    const map = new Map();
    t.forEach(i => {
        const k = key(i);
        if (!map.has(k)) {
            map.set(k, []);
        }
        map.get(k).push(i);
    });
    return map;
}

export function keyBy<T, K>(t: T[], key: (t: T) => K): Map<K, T> {
    return new Map(t.map(t => [key(t), t]));
}
