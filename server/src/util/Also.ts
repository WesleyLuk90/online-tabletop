export function also<T>(value: T, f: (t: T) => void): T {
    f(value);
    return value;
}
