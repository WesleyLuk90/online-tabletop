import React from "react";
import { Link } from "react-router-dom";
import { DefaultLayout } from "../common/DefaultLayout";

export class Dashboard extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>Games</h1>
                <Link to="/games/create">Create</Link>
            </DefaultLayout>
        );
    }
}
