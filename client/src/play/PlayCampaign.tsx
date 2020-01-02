import { User } from "protocol/src/User";
import React, { useEffect } from "react";
import { CampaignLoader } from "./CampaignLoader";
import { GameMap } from "./GameMap";
import { PlayLayout } from "./PlayLayout";
import { Vector } from "./Vector";
import { View } from "./View";

export function PlayCampaign({
    campaignID,
    user
}: {
    campaignID: string;
    user: User;
}) {
    useEffect(() => {
        CampaignLoader.loadCampaign(campaignID, user.id);
    }, [campaignID, user.id]);

    return (
        <PlayLayout
            main={<GameMap view={new View(0.5, new Vector(100, 100))} />}
            right="right"
            bottom="bottom"
        />
    );
}
