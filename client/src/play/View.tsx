import { limit } from "../util/Math";
import { Vector } from "./Vector";
import { Viewport } from "./Viewport";

const MAX_ZOOM = 100;
const MIN_ZOOM = 1 / 100;

export class View {
    constructor(private scale: number, private center: Vector) {}

    getScale() {
        return this.scale;
    }

    pan(pan: Vector) {
        return new View(this.scale, this.center.subtract(pan));
    }

    zoom(scale: number) {
        return new View(
            limit(MIN_ZOOM, MAX_ZOOM, this.scale * scale),
            this.center
        );
    }

    getViewport(screenSize: Vector) {
        const scaled = screenSize.scale(this.scale);
        const topLeft = this.center.subtract(scaled.scale(0.5));
        return new Viewport(
            topLeft.x,
            topLeft.y,
            topLeft.x + scaled.x,
            topLeft.y + scaled.y
        );
    }
}
