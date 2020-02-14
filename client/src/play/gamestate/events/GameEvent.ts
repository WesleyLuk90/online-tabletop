import { Callback } from "../../../util/Callback";
import { GameState } from "../GameState";

export interface GameEventType {
    update(gameState: GameState): GameState;
}

export function reduce(
    gameEvent: GameEventType,
    gameState: GameState
): GameState {
    return gameEvent.update(gameState);
}

export type DispatchGameEvent = Callback<GameEventType>;
