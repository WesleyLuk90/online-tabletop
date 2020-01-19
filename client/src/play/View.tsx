import { Vector } from "./Vector";
import { Viewport } from "./Viewport";

export class View {
    constructor(readonly zoom: number, readonly center: Vector) {}

    pan(pan: Vector) {
        return new View(this.zoom, this.center.subtract(pan));
    }

    getViewport(screenSize: Vector) {
        const scaled = screenSize.scale(this.zoom);
        const topLeft = this.center.subtract(scaled.scale(0.5));
        return new Viewport(
            topLeft.x,
            topLeft.y,
            topLeft.x + scaled.x,
            topLeft.y + scaled.y
        );
    }
}
