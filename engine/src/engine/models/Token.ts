import { Vector } from "./Vector";

export enum TokenType {
    rectangle,
    elipse,
}

class BaseToken {
    constructor(
        readonly id: string,
        readonly position: Vector,
        readonly size: Vector,
        readonly type: TokenType,
        readonly layerID: string
    ) {}
}

export class DrawingToken extends BaseToken {}

export class ObjectToken extends BaseToken {}

export type Token = DrawingToken | ObjectToken;
