import { Rectangle } from "engine/math/Rectangle";
import { Vector } from "engine/math/Vector";
import { Campaign } from "engine/src/engine/models/Campaign";
import { Token } from "engine/src/engine/models/Token";
import { TODO } from "engine/src/utils/Todo";

export class SelectionService {
    private static candidates(gameState: Campaign): Token[] {
        return TODO();
    }

    static point(point: Vector, gameState: Campaign): Token[] {
        return SelectionService.candidates(gameState).filter((t) =>
            t.boundingBox().contains(point)
        );
    }

    static area(area: Rectangle, gameState: Campaign): Token[] {
        return SelectionService.candidates(gameState).filter((t) =>
            t.boundingBox().overlaps(area)
        );
    }
}
