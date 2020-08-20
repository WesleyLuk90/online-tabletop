import { Vector } from "engine/src/math/Vector";

export class Ellipse {
    static fromCorners(a: Vector, b: Vector) {
        return new Ellipse(a.add(b).scale(0.5), b.subtract(a).abs().scale(0.5));
    }

    constructor(readonly center: Vector, readonly radius: Vector) {}

    left() {
        return this.center.x - this.radius.x;
    }

    top() {
        return this.center.y - this.radius.y;
    }

    width() {
        return this.radius.x * 2;
    }

    height() {
        return this.radius.y * 2;
    }
}
