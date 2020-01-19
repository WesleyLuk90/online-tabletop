export class Vector {
    constructor(readonly x: number, readonly y: number) {}

    scale(value: number) {
        return new Vector(this.x * value, this.y * value);
    }

    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

    subtract(other: Vector) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }
}
