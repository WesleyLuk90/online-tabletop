import { Vector } from "./Viewport";

export enum Buttons {
    LEFT = 0,
    RIGHT = 2
}

const MIN_DRAG_DISTANCE = 20;
const DRAG_START_DURATION = 1000;

export class Position {
    constructor(readonly screen: Vector, readonly world: Vector) {}
}

export class MouseState {
    current: Position;
    lastDelta: Vector;
    startTime: number;
    endTime: number | null = null;
    dragDistance: number = 0;
    canceled: boolean = false;

    constructor(
        readonly tokenId: string | null,
        readonly button: number,
        readonly initial: Position
    ) {
        this.current = initial;
        this.lastDelta = this.current.screen;
        this.startTime = new Date().getTime();
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

    worldChange(): Vector {
        return this.current.world.subtract(this.initial.world);
    }

    end(final: Position) {
        this.updatePosition(final);
        this.endTime = new Date().getTime();
    }

    cancel(final: Position) {
        this.updatePosition(final);
        this.endTime = new Date().getTime();
        this.canceled = true;
    }

    isDrag() {
        const endTime = this.endTime || new Date().getTime();
        return (
            this.dragDistance > MIN_DRAG_DISTANCE ||
            endTime - this.startTime > DRAG_START_DURATION
        );
    }
}
