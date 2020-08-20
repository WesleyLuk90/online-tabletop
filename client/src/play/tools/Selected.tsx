import { Vector } from "engine/math/Vector";
import React from "react";
import { GameState } from "../gamestate/GameState";
import { RenderableToken } from "../tokens/RenderableToken";
import { TokenRender } from "../tokens/TokenLayer";
import { SelectionRectangle } from "./SelectionRectangle";

export function Selected({
    gameState,
    offset,
}: {
    gameState: GameState;
    offset: Vector;
}) {
    return (
        <g>
            {gameState
                .getSelectedTokens()
                .map(RenderableToken.fromToken)
                .map((r) => r.withOffset(offset))
                .map((t) => (
                    <TokenRender key={t.key()} token={t} />
                ))}
            {gameState
                .getSelectedTokens()
                .map(RenderableToken.fromToken)
                .map((r) => r.withOffset(offset))
                .map((t) => (
                    <SelectionRectangle
                        key={t.key()}
                        token={t}
                        gameState={gameState}
                    />
                ))}
        </g>
    );
}
