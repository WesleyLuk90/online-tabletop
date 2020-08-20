import { Rectangle } from "engine/math/Rectangle";
import { Vector } from "engine/math/Vector";
import { Color } from "engine/utils/Color";
import React, { useState } from "react";
import { GameState } from "../gamestate/GameState";
import { useMapEvents } from "../input/MapEvents";
import { SvgRect } from "../svg/SvgRect";
import { RenderableToken } from "../tokens/RenderableToken";
import { Selected } from "./Selected";
import { SelectionRectangle } from "./SelectionRectangle";
import { SelectionService } from "./SelectionService";
import { ToolProps } from "./Tool";

const SELECT_STROKE = new Color(2, 39, 141, 0.795);
const SELECT_FILL = new Color(35, 81, 207, 0.308);

function ActiveSelection({
    gameState,
    rect,
}: {
    gameState: GameState;
    rect: Rectangle;
}) {
    return (
        <g>
            {SelectionService.area(rect, gameState).map((t) => (
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

export function SelectTool({ gameState, dispatch, services }: ToolProps) {
    const [startPos, setStartPos] = useState<Vector | null>(null);
    const [currentPos, setCurrentPos] = useState<Vector | null>(null);
    const [isMoving, setIsMoving] = useState(false);

    useMapEvents({
        onClick(loc) {
            const first = SelectionService.point(loc, gameState)[0];
            if (first != null) {
            } else {
            }
        },
        onDragStart(start) {
            const underCursor = SelectionService.point(start, gameState)[0];
            setStartPos(start);
            if (
                underCursor != null &&
                !gameState.selectedTokens.has(underCursor.token)
            ) {
                setIsMoving(true);
            } else {
                setIsMoving(
                    gameState
                        .getSelectedTokens()
                        .map(RenderableToken.fromToken)
                        .some((t) => t.boundingBox.contains(start))
                );
            }
        },
        onDrag(start, current) {
            setCurrentPos(current);
        },
        onDragEnd(start, end) {
            if (!isMoving) {
            } else {
                const delta = end.subtract(start);
                // services.tokenService().update(
                //     gameState.getSelectedTokens().map(t => ({
                //         campaignID: t.campaignID,
                //         tokenID: t.tokenID,
                //         updatedFields: {
                //             x: t.x + delta.x,
                //             y: t.y + delta.y
                //         }
                //     }))
                // );
            }
            setStartPos(null);
            setCurrentPos(null);
            setIsMoving(false);
        },
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
