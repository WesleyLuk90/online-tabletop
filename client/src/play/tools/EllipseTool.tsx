import React from "react";
import { Color, Colors } from "../Colors";
import { Ellipse } from "../Ellipse";
import { EllipseToken } from "../tokens/EllipseToken";
import { Vector } from "../Vector";
import { TokenCreationTool, ToolCreatableToken } from "./Tool";

abstract class AbstractEllipseTool extends TokenCreationTool {
    abstract getEllipse(dragStart: Vector, dragCurrent: Vector): Ellipse;

    render(dragStart: Vector, dragCurrent: Vector) {
        const ellipse = this.getEllipse(dragStart, dragCurrent);
        return (
            <EllipseToken
                ellipse={ellipse}
                strokeColor={Colors[0]}
                strokeWidth={3}
                fillColor={new Color(10, 10, 10, 0.1)}
            />
        );
    }

    create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken {
        const ellipse = this.getEllipse(dragStart, dragEnd);
        return {
            x: ellipse.left(),
            y: ellipse.top(),
            width: ellipse.width(),
            height: ellipse.height(),
            data: {
                type: "ellipse",
                strokeColor: Colors[0],
                strokeWidth: 3,
                fillColor: new Color(10, 10, 10, 0.1)
            }
        };
    }
}

export class EllipseTool extends AbstractEllipseTool {
    getEllipse(dragStart: Vector, dragCurrent: Vector) {
        return Ellipse.fromCorners(dragStart, dragCurrent);
    }
}

export class CenterEllipseTool extends AbstractEllipseTool {
    getEllipse(dragStart: Vector, dragCurrent: Vector) {
        return new Ellipse(dragStart, dragCurrent.subtract(dragStart).abs());
    }
}
