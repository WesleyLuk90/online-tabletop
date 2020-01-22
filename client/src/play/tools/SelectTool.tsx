import React from "react";
import { Rectangle } from "../Rectangle";
import { Vector } from "../Vector";
import "./SelectTool.css";
import { Tool } from "./Tool";

export class SelectTool extends Tool {
    dragEnd() {}
    render(startDrag: Vector, currentDrag: Vector) {
        const rect = Rectangle.fromCorners(startDrag, currentDrag);
        return (
            <rect
                className="select-tool"
                x={rect.left}
                y={rect.top}
                width={rect.width()}
                height={rect.height()}
            />
        );
    }
}
