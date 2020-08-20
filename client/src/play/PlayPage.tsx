import * as React from "react";
import { useParams } from "react-router-dom";
import { Auth } from "../app/Auth";
import { Alert } from "../common/controls/Alert";
import "./PlayPage.css";

export function PlayPage() {
    const { id } = useParams();

    return (
        <Auth
            loggedIn={(user) => (
                // <PlayCampaign user={user} campaignID={checkNotNull(id)} />
                <div>"noop"</div>
            )}
            notLoggedIn={() => <Alert>Please Log In</Alert>}
        />
    );
}
