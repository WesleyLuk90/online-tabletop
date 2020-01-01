import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { EditCampaignPage } from "../games/EditCampaignPage";
import "./App.css";
import { Dashboard } from "./Dashboard";
import { Navigation } from "./Navigation";
import { Routes } from "./Routes";

export class App extends React.Component {
    render() {
        return (
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
            </Router>
        );
    }
}

export default App;
