import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "./Auth";
import "./Navigation.css";

export function Navigation() {
    return (
        <div className="navigation">
            <div>
                <Link className="navigation-link" to="/">
                    Home
                </Link>
            </div>
            <div>
                <Auth
                    loggedIn={user => (
                        <a className="navigation-link" href="/">
                            {user.displayName}
                        </a>
                    )}
                    notLoggedIn={() => (
                        <a className="navigation-link" href="/login">
                            Login
                        </a>
                    )}
                />
            </div>
        </div>
    );
}
