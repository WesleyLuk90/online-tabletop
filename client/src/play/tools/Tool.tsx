import { Token } from "protocol/src/Token";
import { ReactNode } from "react";
import { Callback } from "../../util/Callback";
import { GameState } from "../GameState";
import { Vector } from "../Vector";

export type ToolCreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export interface ToolCallbacks {
    createToken: Callback<ToolCreatableToken>;
    addSelection: Callback<Token[]>;
}

export abstract class Tool {
    abstract dragEnd(
        dragStart: Vector,
        dragEnd: Vector,
        gameState: GameState,
        toolCallbacks: ToolCallbacks
    ): void;
    abstract render(
        dragStart: Vector,
        dragCurrent: Vector,
        gameState: GameState
    ): ReactNode;
}

export abstract class TokenCreationTool extends Tool {
    dragEnd(
        dragStart: Vector,
        dragEnd: Vector,
        gameState: GameState,
        toolCallbacks: ToolCallbacks
    ) {
        toolCallbacks.createToken(this.create(dragStart, dragEnd));
    }
    abstract create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken;
}
