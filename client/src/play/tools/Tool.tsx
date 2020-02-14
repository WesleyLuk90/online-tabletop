import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { GameState } from "../gamestate/GameState";

export interface ToolProps {
    gameState: GameState;
    dispatch: DispatchGameEvent;
}

export interface Tool {
    (props: ToolProps): React.ReactElement | null;
}
