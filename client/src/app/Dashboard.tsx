import { Button } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataLoader } from "../common/DataLoader";
import { DefaultLayout } from "../common/DefaultLayout";
import { GamesService } from "../games/GamesService";
export class Dashboard extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>Games</h1>
                <Link to="/games/create">
                    <Button>New Game</Button>
                </Link>
                <DataLoader load={GamesService.list}>
                    {games => JSON.stringify(games)}
                </DataLoader>
            </DefaultLayout>
        );
    }
}
