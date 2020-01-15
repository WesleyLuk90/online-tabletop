import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { FollowContainer } from "../common/FollowMouse";
import { ModalContainer } from "../common/Modal";
import { EditCampaignPage } from "../games/EditCampaignPage";
import { PlayPage } from "../play/PlayPage";
import "./App.css";
import { Dashboard } from "./Dashboard";
import { Navigation } from "./Navigation";
import { Routes } from "./Routes";

export class App extends React.Component {
    render() {
        return (
            <ModalContainer>
                <FollowContainer>
                    <Router>
                        <Navigation />
                        <Route path="/" exact component={Dashboard} />
                        <Route
                            path={Routes.createCampaign()}
                            exact
                            component={EditCampaignPage}
                        />
                        <Route
                            path={Routes.editCampaign(":id")}
                            exact
                            component={EditCampaignPage}
                        />
                        <Route
                            path={Routes.playGame(":id")}
                            exact
                            component={PlayPage}
                        />
                    </Router>
                </FollowContainer>
            </ModalContainer>
        );
    }
}

export default App;
