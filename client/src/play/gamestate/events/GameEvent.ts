import { Callback } from "../../../util/Callback";
import { GameState } from "../GameState";
import { AddEntity } from "./AddEntity";
import { DeleteEntity } from "./DeleteEntity";
import { DeleteScene } from "./DeleteScene";
import { RequestChangeDefaultScene } from "./RequestChangeDefaultScene";
import { RequestChangeMyScene } from "./RequestChangeMyScene";
import { RequestCreateScene } from "./RequestCreateScene";
import { RequestDeleteScene } from "./RequestDeleteScene";
import { RequestUpdateScene } from "./RequestUpdateScene";
import { UpdateAllEntities } from "./UpdateAllEntities";
import { UpdateCampaign } from "./UpdateCampaign";
import { UpdateEntity } from "./UpdateEntity";
import { UpdateScene } from "./UpdateScene";

export interface GameEventType {
    update(gameState: GameState): GameState;
}

export type GameEvent = (
    | AddEntity
    | DeleteEntity
    | DeleteScene
    | RequestChangeDefaultScene
    | RequestChangeMyScene
    | RequestCreateScene
    | RequestDeleteScene
    | RequestUpdateScene
    | UpdateAllEntities
    | UpdateCampaign
    | UpdateEntity
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
