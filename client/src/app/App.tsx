import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { CreateGamePage } from "../games/CreateGamePage";
import { PlayPage } from "../play/PlayPage";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { Navigation } from "./Navigation";

export class App extends React.Component {
    render() {
        return (
            <Router>
                <Navigation />
                <Route path="/" exact component={Dashboard} />
                <Route path="/games/create" exact component={CreateGamePage} />
                <Route path="/login" exact component={LoginPage} />
                <Route path="/play/:id" exact component={PlayPage} />
            </Router>
        );
    }
}

export default App;
