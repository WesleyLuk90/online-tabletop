import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../app/Routes";
import { Button, ButtonLink } from "../common/Button";
import { SectionList } from "../common/SectionList";
import { CampaignRequests } from "../games/CampaignRequests";
import { useAsyncData } from "../util/AsyncData";

export function CampaignList() {
    const data = useAsyncData(CampaignRequests.list);

    return (
        <div>
            <ButtonLink to={Routes.createCampaign()}>Create</ButtonLink>
            {data(c => (
                <SectionList
                    data={c}
                    id={c => c.id}
                    left={c => (
                        <Link to={Routes.editCampaign(c.id)}>{c.name}</Link>
                    )}
                    right={c => <Button onClick={() => {}}>Launch</Button>}
                />
            ))}
        </div>
    );
}
