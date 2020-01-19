import { Token } from "protocol/src/Token";
import { ReactNode } from "react";
import { Vector } from "../Vector";

export type ToolCreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export abstract class Tool {
    abstract dragEnd(dragStart: Vector, dragEnd: Vector): void;
    abstract render(dragStart: Vector, dragCurrent: Vector): ReactNode;
}

export abstract class TokenCreationTool {
    dragEnd(dragStart: Vector, dragEnd: Vector) {
        console.log(this.create(dragStart, dragEnd));
    }
    abstract create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken;
}
