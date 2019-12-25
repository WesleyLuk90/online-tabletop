export function checkNotNull<T extends {}>(value: T | null | undefined): T {
    if (value == null) {
        throw new Error("Expected not null");
    }
    return value;
}
