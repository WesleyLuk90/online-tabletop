import React from "react";
import { Link } from "react-router-dom";
import { DataLoader } from "../common/DataLoader";
import { CampaignRequests } from "../games/CampaignRequests";

export function CampaignList() {
    return (
        <div>
            <Link to="/campaign/create">Create</Link>
            <DataLoader
                load={() => CampaignRequests.list()}
                render={c => (
                    <div>
                        {c.map(d => (
                            <div key={d.id}>{d.name}</div>
                        ))}
                    </div>
                )}
            />
        </div>
    );
}
