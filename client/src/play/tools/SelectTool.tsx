import { Token } from "protocol/src/Token";
import React from "react";
import { notNull } from "../../util/Nullable";
import { Color } from "../Colors";
import { GameState } from "../GameState";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { Vector } from "../Vector";
import { Tool, ToolCallbacks } from "./Tool";

const SELECT_STROKE = new Color(2, 39, 141, 0.795);
const SELECT_FILL = new Color(35, 81, 207, 0.308);

export class SelectTool extends Tool {
    isDragging = false;

    getSelection(
        startDrag: Vector,
        currentDrag: Vector,
        gameState: GameState
    ): [Token, Rectangle][] {
        const rect = Rectangle.fromCorners(startDrag, currentDrag);
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return [];
        }
        return gameState
            .getTokens()
            .byLayer(layer)
            .filter(t => !gameState.selectedTokens.has(t))
            .map(withBoundingBox)
            .filter(([t, bb]) => bb.overlaps(rect));
    }

    dragEnd(
        dragStart: Vector,
        dragEnd: Vector,
        gameState: GameState,
        toolCallbacks: ToolCallbacks
    ) {
        if (!this.isDragging) {
            toolCallbacks.addSelection(
                this.getSelection(dragStart, dragEnd, gameState).map(
                    ([token]) => token
                )
            );
        } else {
            this.isDragging = false;
            toolCallbacks.dragSelection(null);
        }
    }

    onDrag(
        startDrag: Vector,
        currentDrag: Vector,
        gameState: GameState,
        toolCallbacks: ToolCallbacks
    ) {
        if (
            this.isDragging ||
            gameState.selectedTokens
                .asList()
                .map(id => gameState.getTokens().byId(id))
                .filter(notNull)
                .some(t => Rectangle.fromToken(t).contains(startDrag))
        ) {
            this.isDragging = true;
            toolCallbacks.dragSelection(currentDrag.subtract(startDrag));
        }
    }

    render(startDrag: Vector, currentDrag: Vector, gameState: GameState) {
        if (this.isDragging) {
            return <g></g>;
        }
        const rect = Rectangle.fromCorners(startDrag, currentDrag);
        return (
            <g>
                {this.getSelection(startDrag, currentDrag, gameState).map(
                    ([t, bb]) => {
                        const color = gameState.getLayerColor(t.layerID);
                        return (
                            <SvgRect
                                key={t.tokenID}
                                rect={bb}
                                fillColor={color.withAlpha(0.1)}
                                strokeColor={color}
                                strokeWidth={1}
                            />
                        );
                    }
                )}
                <SvgRect
                    rect={rect}
                    fillColor={SELECT_FILL}
                    strokeColor={SELECT_STROKE}
                    strokeWidth={1}
                />
            </g>
        );
    }
}

function withBoundingBox(token: Token): [Token, Rectangle] {
    return [token, Rectangle.fromToken(token)];
}
