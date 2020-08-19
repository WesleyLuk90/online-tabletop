import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { ModalContainer } from "../common/controls/Modal";
import { FollowContainer } from "../common/mouse/FollowMouse";
import "./App.css";
import { Dashboard } from "./Dashboard";
import { Navigation } from "./Navigation";

export class App extends React.Component {
    render() {
        return (
            <ModalContainer>
                <FollowContainer>
                    <Router>
                        <Navigation />
                        <Route path="/" exact component={Dashboard} />
                        {/* <Route
                            path={Routes.createCampaign()}
                            exact
                            component={EditCampaignPage}
                        />
                        <Route
                            path={Routes.editCampaign(":id")}
                            exact
                            component={EditCampaignPage}
                        /> */}
                        {/* <Route
                            path={Routes.playGame(":id")}
                            exact
                            component={PlayPage}
                        /> */}
                    </Router>
                </FollowContainer>
            </ModalContainer>
        );
    }
}

export default App;
