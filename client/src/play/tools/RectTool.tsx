import React, { useState } from "react";
import { Color, Colors } from "../Colors";
import { useMapEvents } from "../input/MapEvents";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { CreatableToken } from "../tokens/TokenService";
import { ToolProps } from "./Tool";

function rectToken(rect: Rectangle): CreatableToken {
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

export function RectangleTool({ gameState, services }: ToolProps) {
    const [rect, setRect] = useState<Rectangle | null>();
    useMapEvents({
        onDrag: (s, c) => setRect(Rectangle.fromCorners(s, c)),
        onDragEnd: (s, e) => {
            setRect(null);
            services
                .tokenService()
                .create(gameState, rectToken(Rectangle.fromCorners(s, e)));
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

export function CenterRectangleTool({ gameState, services }: ToolProps) {
    const [rect, setRect] = useState<Rectangle | null>();
    useMapEvents({
        onDrag: (s, c) => setRect(Rectangle.fromCenterAndCorner(s, c)),
        onDragEnd: (s, e) => {
            setRect(null);
            services
                .tokenService()
                .create(
                    gameState,
                    rectToken(Rectangle.fromCenterAndCorner(s, e))
                );
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
