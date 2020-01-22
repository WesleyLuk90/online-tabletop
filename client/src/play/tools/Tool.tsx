import { Token } from "protocol/src/Token";
import { ReactNode } from "react";
import { Callback } from "../../util/Callback";
import { GameState } from "../GameState";
import { Vector } from "../Vector";

export type ToolCreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export abstract class Tool {
    abstract dragEnd(
        dragStart: Vector,
        dragEnd: Vector,
        createToken: Callback<ToolCreatableToken>
    ): void;
    abstract render(
        dragStart: Vector,
        dragCurrent: Vector,
        gameState: GameState
    ): ReactNode;
}

export abstract class TokenCreationTool {
    dragEnd(
        dragStart: Vector,
        dragEnd: Vector,
        createToken: Callback<ToolCreatableToken>
    ) {
        createToken(this.create(dragStart, dragEnd));
    }
    abstract create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken;
}
