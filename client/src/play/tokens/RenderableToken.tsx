import { Token } from "engine/engine/models/Token";
import { Rectangle } from "engine/math/Rectangle";
import { Vector } from "engine/math/Vector";

export class RenderableToken {
    readonly boundingBox: Rectangle;

    static fromToken(token: Token) {
        return new RenderableToken(token);
    }

    private constructor(readonly token: Token, boundingBox?: Rectangle) {
        this.boundingBox = boundingBox || Rectangle.fromToken(token);
    }

    key() {
        return this.token.id;
    }

    withOffset(offset: Vector) {
        return new RenderableToken(this.token, this.boundingBox.offset(offset));
    }
}
