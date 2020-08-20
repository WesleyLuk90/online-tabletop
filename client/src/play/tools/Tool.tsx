import { Campaign } from "engine/src/engine/models/Campaign";
import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { Services } from "../Services";

export interface ToolProps {
    game: Campaign;
    services: Services;
    dispatch: DispatchGameEvent;
}

export interface Tool {
    (props: ToolProps): React.ReactElement | null;
}
