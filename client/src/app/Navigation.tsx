import React from "react";
import "./Navigation.css";

export function Navigation() {
    return (
        <div className="navigation">
            <div>left</div>
            <div>
                <a className="navigation-link" href="/login">
                    Login
                </a>
            </div>
        </div>
    );
}
