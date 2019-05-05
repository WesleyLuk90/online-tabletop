import { Toaster } from "@blueprintjs/core";
import * as React from "react";
import { match } from "react-router";
import { GameService } from "./GameService";
import { PlayArea } from "./PlayArea";
import "./PlayPage.css";
import { Message } from "./protocol/Messages";
import { Token } from "./Token";
import { Vector, Viewport } from "./Viewport";

interface State {
    viewport: Viewport;
    selected: string[];
    tokens: Token[];
}

export class PlayPage extends React.Component<
    {
        match: match<{ id: string }>;
    },
    State
> {
    state: State = {
        viewport: Viewport.defaultViewport(),
        selected: [],
        tokens: [
            { id: "1", x: 0, y: 0, width: 100, height: 100 },
            { id: "2", x: -200, y: -200, width: 100, height: 100 }
        ]
    };

    toaster = React.createRef<Toaster>();

    onMessage = (message: Message) => {
        console.log(message);
    };

    onDisconnect = () => {
        if (this.toaster.current) {
            this.toaster.current.show({
                message: "Connection Lost",
                intent: "danger",
                timeout: 0
            });
        }
    };

    gameService = new GameService(
        this.props.match.params.id,
        this.onMessage,
        this.onDisconnect
    );

    onPan = (vector: Vector) => {
        this.setState({
            viewport: this.state.viewport.pan(vector)
        });
    };

    onDrag = (pos: Vector) => {
        const tokens = this.state.tokens.map(t => {
            if (this.state.selected.includes(t.id)) {
                return { ...t, x: t.x + pos.x, y: t.y + pos.y };
            } else {
                return t;
            }
        });
        this.setState({ tokens });
    };

    onSize = (width: number, height: number) => {
        this.setState({
            viewport: this.state.viewport.updateSize(width, height)
        });
    };

    onSelect = (tokens: string[]) => {
        this.setState({ selected: tokens });
    };

    render() {
        return (
            <div className="play-page">
                <Toaster ref={this.toaster} />
                <PlayArea
                    viewport={this.state.viewport}
                    tokens={this.state.tokens}
                    selected={this.state.selected}
                    onPan={this.onPan}
                    onSize={this.onSize}
                    onDrag={this.onDrag}
                    onSelect={this.onSelect}
                />
                <div className="side-bar">Side</div>
            </div>
        );
    }
}
