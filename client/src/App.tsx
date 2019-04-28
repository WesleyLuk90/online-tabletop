import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";
import React from "react";
import "./App.css";

export class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Navbar>
                    <NavbarGroup>
                        <NavbarHeading>Online Tabletop</NavbarHeading>
                        <NavbarDivider />
                        <Button
                            className={Classes.MINIMAL}
                            icon="home"
                            text="Home"
                        />
                    </NavbarGroup>
                    <NavbarGroup align={Alignment.RIGHT}>
                        <Button
                            className={Classes.MINIMAL}
                            icon="user"
                            text="Profile"
                        />
                    </NavbarGroup>
                </Navbar>
            </div>
        );
    }
}

export default App;
