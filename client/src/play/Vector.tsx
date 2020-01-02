export class Vector {
    constructor(readonly x: number, readonly y: number) {}

    scale(value: number) {
        return new Vector(this.x * value, this.y * value);
    }

    subtract(other: Vector) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
}
