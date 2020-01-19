import { User } from "protocol/src/User";
import React, { useEffect, useState } from "react";
import { Spinner } from "../common/Icon";
import { ScenePanel } from "../common/ScenePanel";
import { CampaignLoader } from "./CampaignLoader";
import { EventHandler } from "./EventHandlers";
import { GameMap } from "./GameMap";
import { GameState } from "./GameState";
import { LayersPanel } from "./LayersPanel";
import { PlayLayout } from "./PlayLayout";
import { TokenToolbar } from "./TokenToolbar";
import { Tool } from "./Tools";
import { Vector } from "./Vector";
import { View } from "./View";

export function PlayCampaign({
    campaignID,
    user
}: {
    campaignID: string;
    user: User;
}) {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [tool, setTool] = useState(Tool.select);

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

    const eventHandler = new EventHandler(updater => {
        if (gameState != null) {
            setGameState(updater(gameState));
        }
    });
    const scene = gameState.getMyScene();

    return (
        <PlayLayout
            main={
                scene != null ? (
                    <GameMap
                        view={new View(1, new Vector(0, 0))}
                        scene={scene}
                        tool={tool}
                    />
                ) : (
                    "No scene yet"
                )
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
                        />
                    )}
                </div>
            }
            bottom="bottom"
            toolbar={<TokenToolbar tool={tool} setTool={setTool} />}
        />
    );
}
