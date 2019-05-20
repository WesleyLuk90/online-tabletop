import { Spinner, Toaster } from "@blueprintjs/core";
import { fromNullable } from "fp-ts/lib/Option";
import { Campaign } from "protocol/lib/Campaign";
import { newId } from "protocol/lib/Id";
import { Message } from "protocol/lib/Messages";
import { Updaters } from "protocol/lib/Updaters";
import * as React from "react";
import { match } from "react-router";
import { GameService } from "./GameService";
import {
    FullUpdateCampaignHandler,
    MessageHandler,
    UpdatePlayersHandler
} from "./MessageHandlers";
import { PlayArea } from "./PlayArea";
import "./PlayPage.css";
import { SideBar } from "./SideBar";
import { TokenUpdater } from "./TokenUpdater";
import { TopMenu } from "./TopMenu";
import { Vector, Viewport } from "./Viewport";

interface State {
    viewport: Viewport;
    selected: string[];
    sceneId: string;
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
        sceneId: "foo",
        selected: [],
        campaign: null
    };

    toaster = React.createRef<Toaster>();

    handlers: { [type in Message["type"]]?: MessageHandler<any> } = {
        "full-update-campaign": FullUpdateCampaignHandler,
        "update-players": UpdatePlayersHandler
    };

    onMessage = (message: Message) => {
        const handler = this.handlers[message.type];
        if (handler != null) {
            handler(this, message);
        } else if (this.state.campaign != null) {
            const updated = Updaters.update(this.state.campaign, message);
            if (updated != null) {
                this.setState({ campaign: updated });
            }
        }
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
        fromNullable(this.state.campaign)
            .mapNullable(c => c.scenes[0])
            .map(scene =>
                scene.tokens
                    .filter(t => this.state.selected.includes(t.id))
                    .map(
                        (token): Message => ({
                            type: "update-token",
                            id: newId(),
                            sceneId: scene.id,
                            token: TokenUpdater.translate(token, pos)
                        })
                    )
                    .forEach(update => this.sendMessage(update))
            );
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

    sendMessage = (message: Message) => {
        this.gameService.sendMessage(message);
        if (this.state.campaign != null) {
            const updated = Updaters.update(this.state.campaign, message);
            if (updated != null) {
                this.setState({ campaign: updated });
            }
        }
    };

    render() {
        if (this.state.campaign == null) {
            return <Spinner />;
        }
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
                <div className="play-page__side-bar">
                    <SideBar
                        onMessage={this.sendMessage}
                        sceneId={this.state.sceneId}
                    />
                </div>
                <div className="play-page__top-menu">
                    <TopMenu
                        campaign={this.state.campaign}
                        onMessage={this.sendMessage}
                    />
                </div>
            </div>
        );
    }
}
