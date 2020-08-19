import { Token } from "engine/models/Token";
import { Rectangle } from "../Rectangle";
import { Vector } from "../Vector";

export class RenderableToken {
    readonly boundingBox: Rectangle;

    static fromToken(token: Token) {
        return new RenderableToken(token);
    }

    private constructor(readonly token: Token, boundingBox?: Rectangle) {
        this.boundingBox = boundingBox || Rectangle.fromToken(token);
    }

    key() {
        return this.token.tokenID;
    }

    withOffset(offset: Vector) {
        return new RenderableToken(this.token, this.boundingBox.offset(offset));
    }
}
