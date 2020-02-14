import { User } from "protocol/src/User";
import React, { useEffect, useReducer, useState } from "react";
import { Spinner } from "../common/controls/Icon";
import { CampaignLoader } from "./CampaignLoader";
import { EntityDeltaFactory } from "./entity/EntityDeltaFactory";
import { EntityEditor } from "./entity/EntityEditor";
import { EntityPanel } from "./entity/EntityPanel";
import { EventHandler } from "./EventHandler";
import { GameMap } from "./GameMap";
import { GameEventType, reduce } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";
import { LayersPanel } from "./LayersPanel";
import { GameModes } from "./modes/GameModes";
import { PlayLayout } from "./PlayLayout";
import { ScenePanel } from "./scenes/ScenePanel";
import { TokenToolbar } from "./TokenToolbar";
import { ToolType } from "./tools/ToolType";

export function PlayCampaign({
    campaignID,
    user
}: {
    campaignID: string;
    user: User;
}) {
    const [gameState, dispatch] = useReducer(
        (g: GameState | null, update: GameEventType | GameState | null) => {
            if (g == null) {
                return null;
            }
            if (update == null) {
                return null;
            }
            if (update instanceof GameState) {
                return update;
            }
            return reduce(update, g);
        },
        null
    );
    const [tool, setTool] = useState(ToolType.select);
    const mode = GameModes[0];

    useEffect(() => {
        const loader = new CampaignLoader(campaignID, user, dispatch);

        return () => loader.close();
    }, [campaignID, user]);

    if (gameState == null) {
        return (
            <div>
                Loading <Spinner />
            </div>
        );
    }

    const deltaFactory = new EntityDeltaFactory(gameState.sessionID);

    const eventHandler = new EventHandler(
        gameState.sessionID,
        null as any,
        deltaFactory,
        null as any,
        null as any
    );
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
                            onChange={d => eventHandler.updateEntity(d)}
                            deltaFactory={deltaFactory}
                        />
                    )}
                    {scene != null ? (
                        <GameMap
                            scene={scene}
                            gameState={gameState}
                            tool={tool}
                            toolCallbacks={eventHandler.toolCallbacks()}
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
                            campaignID={campaignID}
                            entityType={entityType}
                            entities={gameState.entities}
                            onAddEntity={e => eventHandler.addEntity(e)}
                            onEditEntity={e => eventHandler.editEntity(e)}
                        />
                    ))}
                </div>
            }
            bottom="bottom"
            toolbar={<TokenToolbar tool={tool} setTool={setTool} />}
        />
    );
}
