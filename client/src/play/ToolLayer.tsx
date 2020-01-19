import { Color, Colors } from "protocol/src/Color";
import React, { ReactNode, useState } from "react";
import { Rectangle } from "./Rectangle";
import { RectangleToken } from "./tokens/RectangleToken";
import { Tool } from "./Tools";
import { Vector } from "./Vector";

export function ToolLayer({
    tool,
    children
}: {
    tool: Tool;
    children: (
        toolContent: ReactNode,
        onClick: (point: Vector) => void,
        onDrag: (start: Vector, current: Vector) => void,
        onDragEnd: (start: Vector, end: Vector) => void
    ) => React.ReactElement;
}) {
    const [dragState, setDragState] = useState<[Vector, Vector] | null>(null);

    function getContent() {
        if (dragState != null) {
            if (tool === Tool.rectangle) {
                const [start, end] = dragState;
                const rect = Rectangle.fromCorners(start, end);
                return (
                    <RectangleToken
                        rect={rect}
                        strokeColor={Colors[0]}
                        strokeWidth={3}
                        fillColor={new Color(10, 10, 10, 0.1)}
                    />
                );
            }
            if (tool === Tool.centerRectangle) {
                const [start, end] = dragState;
                const rect = Rectangle.fromCenterAndCorner(start, end);
                return (
                    <RectangleToken
                        rect={rect}
                        strokeColor={Colors[0]}
                        strokeWidth={3}
                        fillColor={new Color(10, 10, 10, 0.1)}
                    />
                );
            }
        }
        return null;
    }

    return children(
        <g>{getContent()}</g>,
        () => {},
        (s, c) => setDragState([s, c]),
        () => setDragState(null)
    );
}
