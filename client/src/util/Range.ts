export function range(a: number, b?: number): number[] {
    const start = b != null ? a : 0;
    const end = b != null ? b : a;
    return new Array(end - start).fill(0).map((a, i) => i + start);
}
