import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import { User } from "protocol/src/User";
import React, { useEffect, useState } from "react";
import { Spinner } from "../common/Icon";
import { CampaignLoader } from "./CampaignLoader";
import { EventHandler } from "./EventHandlers";
import { GameMap } from "./GameMap";
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
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [scenes, setScenes] = useState<Scene[]>([]);

    useEffect(() => {
        CampaignLoader.loadCampaign(campaignID, user.id).then(
            ([campaign, scenes]) => {
                setCampaign(campaign);
                setScenes(scenes);
            }
        );
    }, [campaignID, user.id]);

    if (campaign == null) {
        return (
            <div>
                Loading <Spinner />
            </div>
        );
    }

    const player = campaign.players.find(p => p.userID === user.id);
    const sceneID = player != null ? player.sceneID : null;
    const scene = scenes.find(s => s.sceneID === sceneID) || null;

    const eventHandler = new EventHandler(campaign, user);

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
                    <SceneSelector
                        scenes={scenes}
                        sceneID={sceneID}
                        onSelect={s => eventHandler.changeMyScene(s)}
                    />
                </div>
            }
            bottom="bottom"
        />
    );
}
