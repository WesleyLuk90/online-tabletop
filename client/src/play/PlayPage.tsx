import * as React from "react";
import { PlayArea } from "./PlayArea";
import "./PlayPage.css";
import { Vector, Viewport } from "./Viewport";

interface State {
    viewport: Viewport;
    selected: string[];
}

export class PlayPage extends React.Component<{}, State> {
    state: State = {
        viewport: Viewport.defaultViewport(),
        selected: []
    };

    getTokens() {
        return [
            { id: "1", x: 0, y: 0, width: 100, height: 100 },
            { id: "2", x: -200, y: -200, width: 100, height: 100 }
        ];
    }

    onPan = (vector: Vector) => {
        this.setState({
            viewport: this.state.viewport.pan(vector)
        });
    };

    onDrag = (pos: Vector) => {
        // console.log(pos);
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
                <PlayArea
                    viewport={this.state.viewport}
                    onPan={this.onPan}
                    onSize={this.onSize}
                    onDrag={this.onDrag}
                    tokens={this.getTokens()}
                    selected={this.state.selected}
                    onSelect={this.onSelect}
                />
                <div className="side-bar">Side</div>
            </div>
        );
    }
}
