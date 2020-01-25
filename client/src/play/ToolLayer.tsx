import React from "react";
import { GameState } from "./GameState";
import { RectangleTool } from "./tools/RectTool";
import { ToolCallbacks } from "./tools/Tool";
import { ToolType } from "./tools/ToolType";

export function ToolLayer({
    tool,
    gameState,
    toolCallbacks
}: {
    tool: ToolType;
    toolCallbacks: ToolCallbacks;
    gameState: GameState;
}) {
    switch (tool) {
        case ToolType.select:
            return null;
        case ToolType.rectangle:
            return (
                <RectangleTool
                    gameState={gameState}
                    callbacks={toolCallbacks}
                />
            );
        case ToolType.centerRectangle:
            return null;
        case ToolType.ellipse:
            return null;
        case ToolType.centerEllipse:
            return null;
    }
}
