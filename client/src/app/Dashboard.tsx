import React from "react";
import { CampaignList } from "../campaign/CampaignList";
import { Page } from "../common/Page";

export class Dashboard extends React.Component {
    render() {
        return (
            <Page title="Campaigns">
                <CampaignList />
            </Page>
        );
    }
}
