import { Card, FormGroup, InputGroup } from "@blueprintjs/core";
import React from "react";
import "./LoginPage.css";

export class LoginPage extends React.Component {
    render() {
        return (
            <Card className="login-page-panel">
                <h1>Login</h1>
                <FormGroup label="Username" labelFor="username">
                    <InputGroup id="username" placeholder="Username" />
                </FormGroup>
            </Card>
        );
    }
}
