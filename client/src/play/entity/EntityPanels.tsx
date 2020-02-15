import React from "react";
import { notNull } from "../../util/Nullable";
import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { GameState } from "../gamestate/GameState";
import { GameMode } from "../modes/GameMode";
import { Services } from "../Services";
import { EntityPanel } from "./EntityPanel";

export function EntityPanels({
    mode,
    gameState,
    dispatch,
    services
}: {
    mode: GameMode;
    gameState: GameState;
    dispatch: DispatchGameEvent;
    services: Services;
}) {
    const types = mode.tokenEntities
        .map(e => mode.entityTypes.find(t => t.id === e.entityTypeID))
        .filter(notNull);
    return (
        <>
            {types.map(entityType => (
                <EntityPanel
                    key={entityType.id}
                    entityType={entityType}
                    entities={gameState.entities}
                    dispatch={dispatch}
                    services={services}
                />
            ))}
        </>
    );
}
