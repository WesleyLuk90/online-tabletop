export function replaceValue<T>(
    list: T[],
    condition: (t: T) => boolean,
    replacement: (t: T) => T
): T[] {
    return list.map(v => {
        if (condition(v)) {
            return replacement(v);
        } else {
            return v;
        }
    });
}
