import * as React from "react";
import { PlayArea, Viewport } from "./PlayArea";
import "./PlayPage.css";

interface State {
    viewport: Viewport;
}

export class PlayPage extends React.Component<{}, State> {
    state: State = {
        viewport: {
            x: 0,
            y: 0,
            width: 1000,
            height: 1000
        }
    };

    onPan = (dx: number, dy: number) => {
        const { x, y } = this.state.viewport;
        this.setState({
            viewport: {
                ...this.state.viewport,
                x: x - dx,
                y: y - dy
            }
        });
    };
    onSize = (width: number, height: number) => {
        this.setState({ viewport: { ...this.state.viewport, width, height } });
    };

    render() {
        return (
            <div className="play-page">
                <PlayArea
                    viewport={this.state.viewport}
                    onPan={this.onPan}
                    onSize={this.onSize}
                />
                <div className="side-bar">Side</div>
            </div>
        );
    }
}
