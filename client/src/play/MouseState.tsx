import { Vector } from "./Viewport";

export enum Buttons {
    LEFT = 0,
    RIGHT = 2
}

const MIN_DRAG_DISTANCE = 20;

export class Position {
    constructor(readonly screen: Vector, readonly world: Vector) {}
}

export class MouseState {
    current: Position;
    lastDelta: Vector;
    startTime: number;
    dragDistance: number = 0;

    constructor(
        readonly tokenId: string | null,
        readonly button: number,
        readonly initial: Position
    ) {
        this.current = initial;
        this.lastDelta = this.current.screen;
        this.startTime = new Date().getTime();
    }

    getButton(): Buttons {
        return this.button;
    }

    updatePosition(current: Position) {
        this.dragDistance += current.screen.distance(this.current.screen);
        this.current = current;
    }

    screenDelta(): Vector {
        const delta = this.current.screen.subtract(this.lastDelta);
        this.lastDelta = this.current.screen;
        return delta;
    }

    isDrag() {
        return this.dragDistance > MIN_DRAG_DISTANCE;
    }
}
