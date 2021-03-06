export function interpolate(min: number, max: number, a: number) {
    return min * (1 - a) + max * a;
}

export function percent(min: number, max: number, a: number) {
    return (a - min) / (max - min);
}

export function limit(min: number, max: number, a: number) {
    if (a < min) {
        return min;
    }
    if (a > max) {
        return max;
    }
    return a;
}
