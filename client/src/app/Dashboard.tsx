import { Button, Card } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataLoader } from "../common/DataLoader";
import { DefaultLayout } from "../common/DefaultLayout";
import { GameRequests } from "../games/GameRequests";
export class Dashboard extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>Games</h1>
                <Link to="/games/create">
                    <Button>New Game</Button>
                </Link>
                <DataLoader load={GameRequests.list}>
                    {games =>
                        games.map(g => (
                            <Card key={g.id}>
                                <h5>{g.name}</h5>
                                <Link to={`/play/${g.id}`}>
                                    <Button>Play</Button>
                                </Link>
                            </Card>
                        ))
                    }
                </DataLoader>
            </DefaultLayout>
        );
    }
}
