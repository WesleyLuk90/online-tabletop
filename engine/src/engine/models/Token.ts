import { Vector } from "./Vector";

class BaseToken {
    constructor(readonly position: Vector, readonly size: Vector) {}
}

export class DrawingToken extends BaseToken {}

export class ObjectToken extends BaseToken {}
