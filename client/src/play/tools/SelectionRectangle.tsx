import React from "react";
import { GameState } from "../GameState";
import { SvgRect } from "../svg/SvgRect";
import { RenderableToken } from "../tokens/RenderableToken";

export function SelectionRectangle({
    token,
    gameState
}: {
    token: RenderableToken;
    gameState: GameState;
}) {
    const color = gameState.getLayerColor(token.token.layerID);
    return (
        <SvgRect
            key={token.token.tokenID}
            rect={token.boundingBox}
            fillColor={color.withAlpha(0.1)}
            strokeColor={color}
            strokeWidth={1}
        />
    );
}
