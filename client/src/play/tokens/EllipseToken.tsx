import { ColorData } from "engine/models/Color";
import React from "react";
import { ColorService } from "../../common/ColorService";
import { Ellipse } from "../Ellipse";

export function EllipseToken({
    ellipse,
    strokeColor,
    fillColor,
    strokeWidth,
}: {
    ellipse: Ellipse;
    strokeColor: ColorData;
    fillColor: ColorData;
    strokeWidth: number;
}) {
    return (
        <ellipse
            cx={ellipse.center.x}
            cy={ellipse.center.y}
            rx={ellipse.radius.x}
            ry={ellipse.radius.y}
            stroke={ColorService.toRGBA(strokeColor)}
            strokeWidth={strokeWidth}
            fill={ColorService.toRGBA(fillColor)}
        />
    );
}
