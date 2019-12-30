import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { CreateGamePage } from "../games/CreateGamePage";
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
                <Route path="/games/create" exact component={CreateGamePage} />
                <Route path="/play/:id" exact component={PlayPage} />
            </Router>
        );
    }
}

export default App;
