import React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonLink } from "../common/Button";
import { SectionList } from "../common/SectionList";
import { CampaignRequests } from "../games/CampaignRequests";
import { useAsyncData } from "../util/AsyncData";

export function CampaignList() {
    const data = useAsyncData(CampaignRequests.list);

    return (
        <div>
            <ButtonLink to="/campaign/create">Create</ButtonLink>
            {data(c => (
                <SectionList
                    data={c}
                    id={c => c.id}
                    left={c => (
                        <Link to={`/campaign/edit/${c.id}`}>{c.name}</Link>
                    )}
                    right={c => <Button onClick={() => {}}>Launch</Button>}
                />
            ))}
        </div>
    );
}
