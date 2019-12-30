import * as React from "react";
import { match } from "react-router";
import { Campaign } from "../../../protocol/src/Campaign";
import { PlayArea } from "./PlayArea";
import "./PlayPage.css";
import { SideBar } from "./SideBar";
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

    // handlers: { [type in Message["type"]]?: MessageHandler<any> } = {
    //     "full-update-campaign": FullUpdateCampaignHandler,
    //     "update-players": UpdatePlayersHandler
    // };

    // onMessage = (message: Message) => {
    //     const handler = this.handlers[message.type];
    //     if (handler != null) {
    //         handler(this, message);
    //     } else if (this.state.campaign != null) {
    //         const updated = Updaters.update(this.state.campaign, message);
    //         if (updated != null) {
    //             this.setState({ campaign: updated });
    //         }
    //     }
    // };

    onPan = (vector: Vector) => {
        this.setState({
            viewport: this.state.viewport.pan(vector)
        });
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
        return [];
    }

    // sendMessage = (message: Message) => {
    //     this.gameService.sendMessage(message);
    //     if (this.state.campaign != null) {
    //         const updated = Updaters.update(this.state.campaign, message);
    //         if (updated != null) {
    //             this.setState({ campaign: updated });
    //         }
    //     }
    // };

    onDrag = () => {};
    sendMessage = () => {};

    render() {
        if (this.state.campaign == null) {
            return "<Spinner />";
        }
        return (
            <div className="play-page">
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
                    <SideBar sceneId={this.state.sceneId} />
                </div>
                <div className="play-page__top-menu"></div>
            </div>
        );
    }
}
