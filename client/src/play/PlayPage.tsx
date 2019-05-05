import { Toaster } from "@blueprintjs/core";
import { fromNullable } from "fp-ts/lib/Option";
import * as React from "react";
import { match } from "react-router";
import { GameService } from "./GameService";
import { MessageHandler, UpdateCampaignHandler } from "./MessageHandlers";
import { PlayArea } from "./PlayArea";
import "./PlayPage.css";
import { Campaign } from "./protocol/Campaign";
import { Message } from "./protocol/Messages";
import { Vector, Viewport } from "./Viewport";

interface State {
    viewport: Viewport;
    selected: string[];
    campaign: Campaign | null;
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
        campaign: null
    };

    toaster = React.createRef<Toaster>();

    handlers: { [type in Message["type"]]: MessageHandler<any> } = {
        "update-campaign": new UpdateCampaignHandler(this),
        "update-token": new UpdateCampaignHandler(this)
    };

    onMessage = (message: Message) => {
        this.handlers[message.type].handle(message);
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
        // const tokens = this.state.tokens.map(t => {
        //     if (this.state.selected.includes(t.id)) {
        //         return { ...t, x: t.x + pos.x, y: t.y + pos.y };
        //     } else {
        //         return t;
        //     }
        // });
        // this.setState({ tokens });
    };

    onSize = (width: number, height: number) => {
        this.setState({
            viewport: this.state.viewport.updateSize(width, height)
        });
    };

    onSelect = (tokens: string[]) => {
        this.setState({ selected: tokens });
    };

    getTokens() {
        return fromNullable(this.state.campaign)
            .mapNullable(c => c.scenes[0])
            .map(s => s.tokens)
            .getOrElse([]);
    }

    render() {
        return (
            <div className="play-page">
                <Toaster ref={this.toaster} />
                <PlayArea
                    viewport={this.state.viewport}
                    tokens={this.getTokens()}
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
