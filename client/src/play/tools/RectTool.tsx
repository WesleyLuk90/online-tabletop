import React from "react";
import { Color, Colors } from "../Colors";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { Vector } from "../Vector";
import { TokenCreationTool, ToolCreatableToken } from "./Tool";

abstract class AbstractRectTool extends TokenCreationTool {
    abstract getRect(dragStart: Vector, dragCurrent: Vector): Rectangle;

    render(dragStart: Vector, dragCurrent: Vector) {
        return (
            <SvgRect
                rect={this.getRect(dragStart, dragCurrent)}
                strokeColor={Colors[0]}
                strokeWidth={3}
                fillColor={new Color(10, 10, 10, 0.1)}
            />
        );
    }

    create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken {
        const rect = this.getRect(dragStart, dragEnd);
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width(),
            height: rect.height(),
            data: {
                type: "square",
                strokeColor: Colors[0],
                strokeWidth: 3,
                fillColor: new Color(10, 10, 10, 0.1)
            }
        };
    }
}

export class RectangleTool extends AbstractRectTool {
    getRect(dragStart: Vector, dragCurrent: Vector) {
        return Rectangle.fromCorners(dragStart, dragCurrent);
    }
}

export class CenterRectangleTool extends AbstractRectTool {
    getRect(dragStart: Vector, dragCurrent: Vector) {
        return Rectangle.fromCenterAndCorner(dragStart, dragCurrent);
    }
}
