import { GameState } from "../GameState";
import { Rectangle } from "../Rectangle";
import { RenderableToken } from "../tokens/RenderableToken";
import { Vector } from "../Vector";

export class SelectionService {
    private static candidates(gameState: GameState) {
        const layer = gameState.getActiveLayer();
        if (layer == null) {
            return [];
        }
        return gameState.tokens
            .byLayer(layer)
            .filter(t => !gameState.selectedTokens.has(t))
            .map(RenderableToken.fromToken);
    }

    static point(point: Vector, gameState: GameState): RenderableToken[] {
        return SelectionService.candidates(gameState).filter(t =>
            t.boundingBox.contains(point)
        );
    }

    static area(area: Rectangle, gameState: GameState): RenderableToken[] {
        return SelectionService.candidates(gameState).filter(t =>
            t.boundingBox.overlaps(area)
        );
    }
}
