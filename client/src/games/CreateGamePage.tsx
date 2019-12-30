import React from "react";
import { DefaultLayout } from "../common/DefaultLayout";
import { GameRequests } from "./GameRequests";

interface State {
    name: string;
}

export class CreateGamePage extends React.Component<{}, State> {
    state: State = {
        name: ""
    };

    onClick = async () => {
        await GameRequests.create(this.state.name);
    };

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: e.target.value });
    };

    render() {
        return (
            <DefaultLayout>
                <h1>Create Game</h1>
            </DefaultLayout>
        );
    }
}
