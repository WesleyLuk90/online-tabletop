import React, { useState } from "react";
import { Color, Colors } from "../Colors";
import { useMapEvents } from "../input/MapEvents";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { ToolCreatableToken, ToolProps } from "./Tool";

function rectToken(rect: Rectangle): ToolCreatableToken {
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

export function RectangleTool({ callbacks: { createToken } }: ToolProps) {
    const [rect, setRect] = useState<Rectangle | null>();
    useMapEvents({
        onDrag: (s, c) => setRect(Rectangle.fromCorners(s, c)),
        onDragEnd: (s, e) => {
            setRect(null);
            createToken(rectToken(Rectangle.fromCorners(s, e)));
        }
    });

    if (!rect) {
        return null;
    }

    return (
        <SvgRect
            rect={rect}
            strokeColor={Colors[0]}
            strokeWidth={3}
            fillColor={new Color(10, 10, 10, 0.1)}
        />
    );
}

export function CenterRectangleTool({ callbacks: { createToken } }: ToolProps) {
    const [rect, setRect] = useState<Rectangle | null>();
    useMapEvents({
        onDrag: (s, c) => setRect(Rectangle.fromCenterAndCorner(s, c)),
        onDragEnd: (s, e) => {
            setRect(null);
            createToken(rectToken(Rectangle.fromCenterAndCorner(s, e)));
        }
    });

    if (!rect) {
        return null;
    }

    return (
        <SvgRect
            rect={rect}
            strokeColor={Colors[0]}
            strokeWidth={3}
            fillColor={new Color(10, 10, 10, 0.1)}
        />
    );
}
