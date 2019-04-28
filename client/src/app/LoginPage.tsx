import { Card } from "@blueprintjs/core";
import React from "react";
import "./LoginPage.css";

export class LoginPage extends React.Component {
    render() {
        return (
            <Card className="login-page-panel">
                <h1>Login</h1>
                <a href="/auth/google">Sign in with Google</a>
            </Card>
        );
    }
}
