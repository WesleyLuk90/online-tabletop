import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../app/Routes";
import { ButtonLink } from "../common/controls/Button";
import { SectionList } from "../common/controls/SectionList";
import { useAsyncData } from "../util/AsyncData";

export function CampaignList() {
    const data = useAsyncData(async () => {
        return new Array<CampaignSummary>(0);
    });

    return (
        <div>
            <ButtonLink to={Routes.createCampaign()}>Create</ButtonLink>
            {data((c) => (
                <SectionList
                    data={c}
                    id={(c) => c.id}
                    left={(c) => (
                        <Link to={Routes.editCampaign(c.id)}>{c.name}</Link>
                    )}
                    right={(c) => (
                        <ButtonLink to={Routes.playGame(c.id)}>
                            Launch
                        </ButtonLink>
                    )}
                />
            ))}
        </div>
    );
}
