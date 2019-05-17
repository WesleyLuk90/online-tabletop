import { Token } from "./protocol/Token";
import { Vector } from "./Viewport";

export class TokenUpdater {
    static translate(token: Token, position: Vector) {
        return { ...token, x: token.x + position.x, y: token.y + position.y };
    }
}
