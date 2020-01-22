import { Token } from "protocol/src/Token";
import React from "react";
import { Color } from "../Colors";
import { GameState } from "../GameState";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { Vector } from "../Vector";
import { Tool } from "./Tool";

const SELECT_STROKE = new Color(2, 39, 141, 0.795);
const SELECT_FILL = new Color(35, 81, 207, 0.308);

export class SelectTool extends Tool {
    dragEnd() {}

    render(startDrag: Vector, currentDrag: Vector, gameState: GameState) {
        const rect = Rectangle.fromCorners(startDrag, currentDrag);
        const tokens = gameState.tokens
            .map(withBoundingBox)
            .filter(([t, bb]) => bb.overlaps(rect));
        return (
            <g>
                {tokens.map(([t, bb]) => {
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
                })}
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
