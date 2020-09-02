export function upsertList<T>(
    list: T[],
    condition: (t: T) => T,
    value: T
): T[] {
    let found = false;
    let updated = list.map((t) => {
        if (condition(t)) {
            found = true;
            return value;
        } else {
            return t;
        }
    });
    if (found) {
        return updated;
    }
    return [...list, value];
}
