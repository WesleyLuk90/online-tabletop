import { Color } from "engine/utils/Color";
import React from "react";
import { ColorService } from "../../common/ColorService";
import { Rectangle } from "engine/math/Rectangle";

export function SvgRect({
    rect,
    strokeColor,
    fillColor,
    strokeWidth,
}: {
    rect: Rectangle;
    strokeColor: Color;
    fillColor: Color;
    strokeWidth: number;
}) {
    return (
        <rect
            x={rect.left}
            y={rect.top}
            width={rect.width()}
            height={rect.height()}
            stroke={ColorService.toRGBA(strokeColor)}
            strokeWidth={strokeWidth}
            fill={ColorService.toRGBA(fillColor)}
        />
    );
}
