import React, { ReactNode, useState } from "react";
import { Callback } from "../util/Callback";
import { GameState } from "./GameState";
import { CenterEllipseTool, EllipseTool } from "./tools/EllipseTool";
import { CenterRectangleTool, RectangleTool } from "./tools/RectTool";
import { SelectTool } from "./tools/SelectTool";
import { Tool, ToolCreatableToken } from "./tools/Tool";
import { ToolType } from "./tools/ToolType";
import { Vector } from "./Vector";

const ToolHandlers: { [t in ToolType]: Tool } = {
    [ToolType.select]: new SelectTool(),
    [ToolType.rectangle]: new RectangleTool(),
    [ToolType.centerRectangle]: new CenterRectangleTool(),
    [ToolType.ellipse]: new EllipseTool(),
    [ToolType.centerEllipse]: new CenterEllipseTool()
};

export function ToolLayer({
    tool,
    children,
    gameState
}: {
    tool: ToolType;
    children: (
        toolContent: ReactNode,
        onClick: Callback<Vector>,
        onDrag: (start: Vector, current: Vector) => void,
        onDragEnd: (
            start: Vector,
            end: Vector,
            createToken: Callback<ToolCreatableToken>
        ) => void
    ) => React.ReactElement;
    gameState: GameState;
}) {
    const [dragState, setDragState] = useState<[Vector, Vector] | null>(null);

    function getContent() {
        if (dragState != null) {
            const handler = ToolHandlers[tool];
            if (handler != null) {
                const [start, end] = dragState;
                return handler.render(start, end, gameState);
            }
        }
        return null;
    }

    function onDragEnd(
        start: Vector,
        end: Vector,
        createToken: Callback<ToolCreatableToken>
    ) {
        const handler = ToolHandlers[tool];
        if (handler != null) {
            handler.dragEnd(start, end, createToken);
        }
        setDragState(null);
    }

    return children(
        <g>{getContent()}</g>,
        () => {},
        (s, c) => setDragState([s, c]),
        onDragEnd
    );
}
