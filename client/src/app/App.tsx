import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { CreateGamePage } from "../games/EditCampaignPage";
import { PlayPage } from "../play/PlayPage";
import "./App.css";
import { Dashboard } from "./Dashboard";
import { Navigation } from "./Navigation";

export class App extends React.Component {
    render() {
        return (
            <Router>
                <Navigation />
                <Route path="/" exact component={Dashboard} />
                <Route path="/campaign/:id" exact component={CreateGamePage} />
                <Route path="/play/:id" exact component={PlayPage} />
            </Router>
        );
    }
}

export default App;
