export function checkNotNull<T extends {}>(
    value: T | null | undefined,
    message?: string
): T {
    if (value == null) {
        throw new Error(message || "Expected not null");
    }
    return value;
}

export function notNull<T extends {}>(t: T | null | undefined): t is T {
    return t != null;
}
