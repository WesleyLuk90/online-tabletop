import React from "react";
import { DataLoader } from "../common/DataLoader";
import { DefaultLayout } from "../common/DefaultLayout";
import { GamesService } from "../games/GamesService";
export class Dashboard extends React.Component {
    render() {
        return (
            <DefaultLayout>
                <h1>Games</h1>
                <DataLoader load={GamesService.list}>
                    {games => JSON.stringify(games)}
                </DataLoader>
            </DefaultLayout>
        );
    }
}
