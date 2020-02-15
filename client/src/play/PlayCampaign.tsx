import { User } from "protocol/src/User";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { Spinner } from "../common/controls/Icon";
import { EntityEditor } from "./entity/EntityEditor";
import { EntityPanel } from "./entity/EntityPanel";
import { GameMap } from "./GameMap";
import { GameEvent, reduce } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";
import { LayersPanel } from "./LayersPanel";
import { GameModes } from "./modes/GameModes";
import { PlayLayout } from "./PlayLayout";
import { ScenePanel } from "./scenes/ScenePanel";
import { Services } from "./Services";
import { TokenToolbar } from "./TokenToolbar";
import { ToolType } from "./tools/ToolType";

function reduceGameState(
    g: GameState | null,
    update: GameEvent | GameState | null
) {
    if (update == null) {
        return null;
    }
    if (update instanceof GameState) {
        return update;
    }
    if (g == null) {
        return null;
    }
    return reduce(update, g);
}

export function PlayCampaign({
    campaignID,
    user
}: {
    campaignID: string;
    user: User;
}) {
    const [gameState, dispatch] = useReducer(reduceGameState, null);
    const [tool, setTool] = useState(ToolType.select);
    const mode = GameModes[0];

    const services = useRef(new Services(campaignID, user, dispatch));

    useEffect(() => {
        const current = services.current;
        current.loader().start();
        return () => current.loader().stop();
    }, []);

    if (gameState == null) {
        return (
            <div>
                Loading <Spinner />
            </div>
        );
    }

    const scene = gameState.getMyScene();
    const editEntity = gameState.entities.get(gameState.editEntity);

    return (
        <PlayLayout
            main={
                <>
                    {editEntity && (
                        <EntityEditor
                            entity={editEntity}
                            gameMode={mode}
                            services={services.current}
                        />
                    )}
                    {scene != null ? (
                        <GameMap
                            scene={scene}
                            gameState={gameState}
                            tool={tool}
                            dispatch={dispatch}
                            services={services.current}
                        />
                    ) : (
                        "No scene yet"
                    )}
                </>
            }
            right={
                <div>
                    <ScenePanel
                        campaign={gameState.campaign}
                        myScene={gameState.getMySceneID()}
                        defaultScene={gameState.campaign.sceneID}
                        scenes={gameState.scenes}
                        dispatch={dispatch}
                    />
                    {scene && (
                        <LayersPanel
                            sceneID={scene.sceneID}
                            layers={scene.layers}
                            activeLayer={gameState.getActiveLayer()}
                            dispatch={dispatch}
                        />
                    )}
                    {mode.entityTypes.map(entityType => (
                        <EntityPanel
                            key={entityType.id}
                            entityType={entityType}
                            entities={gameState.entities}
                            dispatch={dispatch}
                            services={services.current}
                        />
                    ))}
                </div>
            }
            bottom="bottom"
            toolbar={<TokenToolbar tool={tool} setTool={setTool} />}
        />
    );
}
