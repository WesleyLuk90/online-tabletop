export interface Viewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly scale: number;
}

export interface Position {
    x: number;
    y: number;
}

export function left(viewport: Viewport): number {
    return viewport.x - viewport.width / 2;
}
export function right(viewport: Viewport): number {
    return viewport.x + viewport.width / 2;
}
export function top(viewport: Viewport): number {
    return viewport.y - viewport.height / 2;
}
export function bottom(viewport: Viewport): number {
    return viewport.y + viewport.height / 2;
}

export function pan(viewport: Viewport, dx: number, dy: number): Viewport {
    return { ...viewport, x: viewport.x + dx, y: viewport.y + dy };
}

export function defaultViewport(): Viewport {
    return {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000,
        scale: 1
    };
}

export function toWorldCoordinates(
    viewport: Viewport,
    position: Position
): Position {
    return {
        x: left(viewport) + position.x * viewport.scale,
        y: top(viewport) + position.y * viewport.scale
    };
}
