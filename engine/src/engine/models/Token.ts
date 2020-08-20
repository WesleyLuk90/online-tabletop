import { Rectangle } from "../../math/Rectangle";
import { Vector } from "../../math/Vector";

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

    boundingBox() {
        return Rectangle.fromCorners(
            this.position,
            this.position.add(this.size)
        );
    }
}

export class DrawingToken extends BaseToken {}

export class ObjectToken extends BaseToken {}

export type Token = DrawingToken | ObjectToken;
