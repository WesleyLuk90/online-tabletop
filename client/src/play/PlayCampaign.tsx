import { User } from "protocol/src/User";
import React, { useEffect } from "react";
import { CampaignLoader } from "./CampaignLoader";

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

    return <div>foo</div>;
}
