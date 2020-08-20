import { Rectangle } from "engine/math/Rectangle";
import { Vector } from "engine/math/Vector";
import { GameState } from "../gamestate/GameState";
import { RenderableToken } from "../tokens/RenderableToken";

export class SelectionService {
    private static candidates(gameState: GameState) {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return [];
        }
        return gameState.tokens
            .byLayer(layer)
            .filter((t) => !gameState.selectedTokens.has(t))
            .map(RenderableToken.fromToken);
    }

    static point(point: Vector, gameState: GameState): RenderableToken[] {
        return SelectionService.candidates(gameState).filter((t) =>
            t.boundingBox.contains(point)
        );
    }

    static area(area: Rectangle, gameState: GameState): RenderableToken[] {
        return SelectionService.candidates(gameState).filter((t) =>
            t.boundingBox.overlaps(area)
        );
    }
}
