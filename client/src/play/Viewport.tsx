export class Viewport {
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
}
