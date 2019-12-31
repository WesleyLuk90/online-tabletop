import React from "react";
import { Link } from "react-router-dom";
import { DefaultLayout } from "../common/DefaultLayout";

export class Dashboard extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>Campaigns</h1>
                <Link to="/campaign/create">Create</Link>
            </DefaultLayout>
        );
    }
}
