import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
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
                <FormGroup
                    label="Game Name"
                    labelFor="game-name"
                    labelInfo="(required)"
                >
                    <InputGroup
                        id="game-name"
                        placeholder="My First Game"
                        value={this.state.name}
                        onChange={this.onChange}
                    />
                </FormGroup>
                <Button onClick={this.onClick}>Create</Button>
            </DefaultLayout>
        );
    }
}
