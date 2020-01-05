import { User } from "protocol/src/User";
import React, { useEffect, useState } from "react";
import { Spinner } from "../common/Icon";
import { CampaignLoader } from "./CampaignLoader";
import { EventHandler } from "./EventHandlers";
import { GameMap } from "./GameMap";
import { GameState } from "./GameState";
import { PlayLayout } from "./PlayLayout";
import { SceneSelector } from "./SceneSelector";
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

    const eventHandler = new EventHandler(gameState);
    const scene = gameState.getMyScene();

    return (
        <PlayLayout
            main={
                scene != null ? (
                    <GameMap
                        view={new View(1, new Vector(100, 100))}
                        scene={scene}
                    />
                ) : (
                    "No scene yet"
                )
            }
            right={
                <div>
                    {gameState.campaign.name}
                    <SceneSelector
                        scenes={gameState.scenes}
                        scene={gameState.getMyScene()}
                        onSelect={s => eventHandler.changeMyScene(s)}
                    />
                </div>
            }
            bottom="bottom"
        />
    );
}
