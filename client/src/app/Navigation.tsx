import {
    Alignment,
    Button,
    Classes,
    IconName,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

class NavButton extends React.Component<{
    icon: IconName;
    text: string;
    to: string;
}> {
    render() {
        return (
            <Link to={this.props.to} className="nav-button-link">
                <Button
                    className={Classes.MINIMAL}
                    icon={this.props.icon}
                    text={this.props.text}
                />
            </Link>
        );
    }
}

export class Navigation extends React.Component {
    render() {
        return (
            <Navbar>
                <NavbarGroup>
                    <NavbarHeading>Online Tabletop</NavbarHeading>
                    <NavbarDivider />
                    <NavButton icon="home" text="Home" to="/" />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavButton icon="user" text="Profile" to="/" />
                    <NavButton icon="log-in" text="Login" to="/login" />
                </NavbarGroup>
            </Navbar>
        );
    }
}
