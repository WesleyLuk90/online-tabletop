export interface Viewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export function left(viewport: Viewport) {
    return viewport.x - viewport.width / 2;
}
export function right(viewport: Viewport) {
    return viewport.x + viewport.width / 2;
}
export function top(viewport: Viewport) {
    return viewport.y - viewport.height / 2;
}
export function bottom(viewport: Viewport) {
    return viewport.y + viewport.height / 2;
}
