export function notNull<T extends any>(t: T | undefined | null): t is T {
    return t != null;
}

export function checkNotNull<T extends any>(
    t: T | undefined | null,
    message?: () => string
): T {
    if (t == null) {
        throw new Error(message != null ? message() : "Expected not null");
    }
    return t;
}
