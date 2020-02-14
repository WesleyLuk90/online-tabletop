import { User } from "protocol/src/User";
import React, { useEffect, useReducer, useState } from "react";
import { Spinner } from "../common/controls/Icon";
import { CampaignLoader } from "./CampaignLoader";
import { EntityDeltaFactory } from "./entity/EntityDeltaFactory";
import { EntityEditor } from "./entity/EntityEditor";
import { EntityPanel } from "./entity/EntityPanel";
import { GameMap } from "./GameMap";
import { GameEvent, reduce } from "./gamestate/events/GameEvent";
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
        (g: GameState | null, update: GameEvent | GameState | null) => {
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
                            deltaFactory={deltaFactory}
                            dispatch={dispatch}
                        />
                    )}
                    {scene != null ? (
                        <GameMap
                            scene={scene}
                            gameState={gameState}
                            tool={tool}
                            dispatch={dispatch}
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
                            dispatch={dispatch}
                        />
                    ))}
                </div>
            }
            bottom="bottom"
            toolbar={<TokenToolbar tool={tool} setTool={setTool} />}
        />
    );
}
