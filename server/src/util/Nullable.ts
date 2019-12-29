export function checkNotNull<T extends {}>(
    value: T | null | undefined,
    message?: string
): T {
    if (value == null) {
        throw new Error(message || "Expected not null");
    }
    return value;
}
