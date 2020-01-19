import React, { ReactNode, useState } from "react";
import { CenterRectangleTool, RectangleTool } from "./tools/RectTool";
import { Tool } from "./tools/Tool";
import { ToolType } from "./tools/ToolType";
import { Vector } from "./Vector";

const ToolHandlers: { [t in ToolType]?: Tool } = {
    [ToolType.rectangle]: new RectangleTool(),
    [ToolType.centerRectangle]: new CenterRectangleTool()
};

export function ToolLayer({
    tool,
    children
}: {
    tool: ToolType;
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
            const handler = ToolHandlers[tool];
            if (handler != null) {
                const [start, end] = dragState;
                return handler.render(start, end);
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
