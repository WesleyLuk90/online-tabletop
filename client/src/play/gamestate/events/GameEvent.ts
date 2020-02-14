import { Callback } from "../../../util/Callback";
import { GameState } from "../GameState";
import { DeleteScene } from "./DeleteScene";
import { RequestChangeDefaultScene } from "./RequestChangeDefaultScene";
import { RequestChangeMyScene } from "./RequestChangeMyScene";
import { UpdateCampaign } from "./UpdateCampaign";
import { UpdateEntity } from "./UpdateEntity";
import { UpdateScene } from "./UpdateScene";

export interface GameEventType {
    update(gameState: GameState): GameState;
}

export type GameEvent = (
    | RequestChangeMyScene
    | RequestChangeDefaultScene
    | UpdateEntity
    | UpdateCampaign
    | DeleteScene
    | UpdateScene
) &
    GameEventType;

export function reduce(
    gameEvent: GameEvent & GameEventType,
    gameState: GameState
): GameState {
    return gameEvent.update(gameState);
}

export type DispatchGameEvent = Callback<GameEvent & GameEventType>;
