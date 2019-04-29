import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { Navigation } from "./Navigation";

export class App extends React.Component {
    render() {
        return (
            <Router>
                <Navigation />
                <Route path="/" exact component={Dashboard} />
                <Route path="/login" exact component={LoginPage} />
            </Router>
        );
    }
}

export default App;
