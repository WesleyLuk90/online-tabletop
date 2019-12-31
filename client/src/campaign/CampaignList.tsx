import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { DataLoader } from "../common/DataLoader";
import { SectionList } from "../common/SectionList";
import { CampaignRequests } from "../games/CampaignRequests";

export function CampaignList() {
    return (
        <div>
            <Link to="/campaign/create">Create</Link>
            <DataLoader
                load={() => CampaignRequests.list()}
                render={c => (
                    <SectionList
                        data={c}
                        id={c => c.id}
                        left={c => (
                            <Link to={`/campaign/edit/${c.id}`}>{c.name}</Link>
                        )}
                        right={c => <Button onClick={() => {}}>Launch</Button>}
                    />
                )}
            />
        </div>
    );
}
