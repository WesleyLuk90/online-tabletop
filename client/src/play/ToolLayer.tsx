import React from "react";
import { assertExhaustive } from "../util/Exaustive";
import { DispatchGameEvent } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";
import { CenterEllipseTool, EllipseTool } from "./tools/EllipseTool";
import { CenterRectangleTool, RectangleTool } from "./tools/RectTool";
import { SelectTool } from "./tools/SelectTool";
import { ToolType } from "./tools/ToolType";

export function ToolLayer({
    tool,
    gameState,
    dispatch
}: {
    tool: ToolType;
    dispatch: DispatchGameEvent;
    gameState: GameState;
}) {
    switch (tool) {
        case ToolType.select:
            return <SelectTool gameState={gameState} dispatch={dispatch} />;
        case ToolType.rectangle:
            return <RectangleTool gameState={gameState} dispatch={dispatch} />;
        case ToolType.centerRectangle:
            return (
                <CenterRectangleTool
                    gameState={gameState}
                    dispatch={dispatch}
                />
            );
        case ToolType.ellipse:
            return <EllipseTool gameState={gameState} dispatch={dispatch} />;
        case ToolType.centerEllipse:
            return (
                <CenterEllipseTool gameState={gameState} dispatch={dispatch} />
            );
        default:
            return assertExhaustive(tool);
    }
}
