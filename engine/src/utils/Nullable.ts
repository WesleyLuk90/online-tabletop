export function notNull<T extends any>(t: T | undefined | null): t is T {
    return t != null;
}
