export class Viewport {
    static defaultViewport(): Viewport {
        return new Viewport(0, 0, 1000, 1000, 1);
    }

    constructor(
        readonly x: number,
        readonly y: number,
        readonly width: number,
        readonly height: number,
        readonly scale: number
    ) {}

    copy(values: Partial<Viewport>): Viewport {
        return Object.assign(
            new Viewport(this.x, this.y, this.width, this.height, this.scale),
            values
        );
    }

    left(): number {
        return this.x - this.width / 2;
    }

    right(): number {
        return this.x + this.width / 2;
    }

    top(): number {
        return this.y - this.height / 2;
    }

    bottom(): number {
        return this.y + this.height / 2;
    }

    pan(vector: Vector): Viewport {
        return this.copy({ x: this.x + vector.x, y: this.y + vector.y });
    }

    updateSize(width: number, height: number): Viewport {
        return this.copy({ width, height });
    }

    toWorldCoordinates(position: Vector): Vector {
        return new Vector(
            this.left() + position.x * this.scale,
            this.top() + position.y * this.scale
        );
    }

    formatViewport() {
        return `${this.x - this.width / 2} ${this.y - this.height / 2} ${
            this.width
        } ${this.height}`;
    }
}

export class Vector {
    static fromMouseEvent(e: React.MouseEvent): Vector {
        return new Vector(e.clientX, e.clientY);
    }

    constructor(readonly x: number, readonly y: number) {}

    distance(other: Vector): number {
        const d = this.subtract(other);
        return Math.sqrt(d.x * d.x + d.y * d.y);
    }

    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    negative(): Vector {
        return new Vector(-this.x, -this.y);
    }
}
