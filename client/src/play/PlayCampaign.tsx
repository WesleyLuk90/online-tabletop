import { User } from "protocol/src/User";
import React, { useEffect, useState } from "react";
import { Spinner } from "../common/controls/Icon";
import { CampaignLoader } from "./CampaignLoader";
import { EntityDeltaFactory } from "./entity/EntityDeltaFactory";
import { EntityEditor } from "./entity/EntityEditor";
import { EntityPanel } from "./entity/EntityPanel";
import { EventHandler } from "./EventHandler";
import { GameMap } from "./GameMap";
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
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [tool, setTool] = useState(ToolType.select);
    const mode = GameModes[0];

    useEffect(() => {
        const loader = new CampaignLoader(campaignID, user, updater =>
            setGameState(updater)
        );

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
        updater => {
            if (gameState != null) {
                setGameState(updater(gameState));
            }
        },
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
                        onChangeScene={s => eventHandler.changeMyScene(s)}
                        onChangeDefaultScene={s =>
                            eventHandler.changeDefaultScene(s)
                        }
                        onUpdateScene={(id, updates) =>
                            eventHandler.updateSceneDetails(id, updates)
                        }
                        onCreateScene={scene => eventHandler.createScene(scene)}
                        onDeleteScene={scene => eventHandler.deleteScene(scene)}
                    />
                    {scene && (
                        <LayersPanel
                            layers={scene.layers}
                            onCreate={l => eventHandler.createLayer(scene, l)}
                            onUpdate={l => eventHandler.updateLayer(scene, l)}
                            onDelete={l => eventHandler.deleteLayer(scene, l)}
                            onSort={layers =>
                                eventHandler.updateSceneDetails(scene.sceneID, {
                                    layers
                                })
                            }
                            activeLayer={gameState.getActiveLayer()}
                            onChangeActiveLayer={l =>
                                eventHandler.changeActiveLayer(l)
                            }
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
