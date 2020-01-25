import React, { useState } from "react";
import { Color } from "../Colors";
import { GameState } from "../GameState";
import { useMapEvents } from "../input/MapEvents";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { RenderableToken } from "../tokens/RenderableToken";
import { Vector } from "../Vector";
import { Selected } from "./Selected";
import { SelectionRectangle } from "./SelectionRectangle";
import { ToolProps } from "./Tool";

const SELECT_STROKE = new Color(2, 39, 141, 0.795);
const SELECT_FILL = new Color(35, 81, 207, 0.308);

function ActiveSelection({
    gameState,
    rect
}: {
    gameState: GameState;
    rect: Rectangle;
}) {
    return (
        <g>
            {computeSelection(rect, gameState).map(t => (
                <SelectionRectangle
                    key={t.key()}
                    token={t}
                    gameState={gameState}
                />
            ))}
            <SvgRect
                rect={rect}
                fillColor={SELECT_FILL}
                strokeColor={SELECT_STROKE}
                strokeWidth={1}
            />
        </g>
    );
}

export function SelectTool({
    gameState,
    callbacks: { addSelection }
}: ToolProps) {
    const [startPos, setStartPos] = useState<Vector | null>(null);
    const [currentPos, setCurrentPos] = useState<Vector | null>(null);
    const [isMoving, setIsMoving] = useState(false);

    useMapEvents({
        onDragStart(s) {
            setStartPos(s);
            setIsMoving(
                gameState
                    .getSelectedTokens()
                    .map(RenderableToken.fromToken)
                    .some(t => t.boundingBox.contains(s))
            );
        },
        onDrag(s, c) {
            setCurrentPos(c);
        },
        onDragEnd(s, e) {
            if (!isMoving) {
                addSelection(
                    computeSelection(
                        Rectangle.fromCorners(s, e),
                        gameState
                    ).map(t => t.token)
                );
            }
            setStartPos(null);
            setCurrentPos(null);
            setIsMoving(false);
        }
    });

    if (startPos == null || currentPos == null) {
        return <Selected gameState={gameState} offset={new Vector(0, 0)} />;
    }

    if (isMoving) {
        return (
            <Selected
                gameState={gameState}
                offset={currentPos.subtract(startPos)}
            />
        );
    }

    const rect = Rectangle.fromCorners(startPos, currentPos);

    return (
        <g>
            <Selected gameState={gameState} offset={new Vector(0, 0)} />;
            <ActiveSelection rect={rect} gameState={gameState} />
        </g>
    );
}

function computeSelection(
    area: Rectangle,
    gameState: GameState
): RenderableToken[] {
    const layer = gameState.getActiveLayer();
    if (layer == null) {
        return [];
    }
    return gameState
        .getTokens()
        .byLayer(layer)
        .filter(t => !gameState.selectedTokens.has(t))
        .map(RenderableToken.fromToken)
        .filter(t => t.boundingBox.overlaps(area));
}
