import React from "react";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./App.css";
import { Button } from "@blueprintjs/core";

export class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Button intent="success" text="button content" />
            </div>
        );
    }
}

export default App;
