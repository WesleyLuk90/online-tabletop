import React from "react";
import { CampaignList } from "../campaign/CampaignList";
import { Page } from "../common/layout/Page";
import { Auth } from "./Auth";

export class Dashboard extends React.Component {
    render() {
        return (
            <Auth
                loggedIn={() => (
                    <Page title="Campaigns">
                        <CampaignList />
                    </Page>
                )}
                notLoggedIn={() => <div>Please log in</div>}
            />
        );
    }
}
