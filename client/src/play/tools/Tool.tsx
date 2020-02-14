import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { GameState } from "../gamestate/GameState";
import { Services } from "../Services";

export interface ToolProps {
    gameState: GameState;
    services: Services;
    dispatch: DispatchGameEvent;
}

export interface Tool {
    (props: ToolProps): React.ReactElement | null;
}
