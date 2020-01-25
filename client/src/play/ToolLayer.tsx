import React from "react";
import { assertExhaustive } from "../util/Exaustive";
import { GameState } from "./GameState";
import { CenterEllipseTool, EllipseTool } from "./tools/EllipseTool";
import { CenterRectangleTool, RectangleTool } from "./tools/RectTool";
import { SelectTool } from "./tools/SelectTool";
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
            return (
                <SelectTool gameState={gameState} callbacks={toolCallbacks} />
            );
        case ToolType.rectangle:
            return (
                <RectangleTool
                    gameState={gameState}
                    callbacks={toolCallbacks}
                />
            );
        case ToolType.centerRectangle:
            return (
                <CenterRectangleTool
                    gameState={gameState}
                    callbacks={toolCallbacks}
                />
            );
        case ToolType.ellipse:
            return (
                <EllipseTool gameState={gameState} callbacks={toolCallbacks} />
            );
        case ToolType.centerEllipse:
            return (
                <CenterEllipseTool
                    gameState={gameState}
                    callbacks={toolCallbacks}
                />
            );
        default:
            return assertExhaustive(tool);
    }
}
