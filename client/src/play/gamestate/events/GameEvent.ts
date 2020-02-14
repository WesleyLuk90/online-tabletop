import { Callback } from "../../../util/Callback";
import { GameState } from "../GameState";

export interface GameEvent {
    update(gameState: GameState): GameState;
}

export function reduce(gameEvent: GameEvent, gameState: GameState): GameState {
    return gameEvent.update(gameState);
}

export type DispatchGameEvent = Callback<GameEvent>;
