import { Vector } from "./Vector";

export class Rectangle {
    static fromCorners(a: Vector, b: Vector) {
        return new Rectangle(
            Math.min(a.x, b.x),
            Math.min(a.y, b.y),
            Math.max(a.x, b.x),
            Math.max(a.y, b.y)
        );
    }

    static fromCenterAndCorner(center: Vector, corner: Vector) {
        const d = corner.subtract(center);
        return Rectangle.fromCorners(center.subtract(d), center.add(d));
    }

    constructor(
        readonly left: number,
        readonly top: number,
        readonly right: number,
        readonly bottom: number
    ) {}

    width() {
        return this.right - this.left;
    }

    height() {
        return this.bottom - this.top;
    }

    topLeft() {
        return new Vector(this.left, this.top);
    }

    bottomRight() {
        return new Vector(this.right, this.bottom);
    }

    overlaps(rect: Rectangle) {
        const hasSeparatingPlane =
            rect.right < this.left ||
            this.right < rect.left ||
            rect.bottom < this.top ||
            this.bottom < rect.top;

        return !hasSeparatingPlane;
    }
}
