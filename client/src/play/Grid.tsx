import React from "react";
import { bottom, top, Viewport } from "./Viewport";

const GRID_SIZE = 70;

interface Props {
    viewport: Viewport;
}

export class Grid extends React.Component<Props> {
    renderVertical() {
        const { x, width } = this.props.viewport;
        const y1 = top(this.props.viewport);
        const y2 = bottom(this.props.viewport);
        const start = Math.floor((x - width / 2) / GRID_SIZE) * GRID_SIZE;
        return new Array(Math.floor(width / GRID_SIZE))
            .fill(0)
            .map((a, i) => i)
            .map(i => (
                <line
                    y1={y1}
                    y2={y2}
                    x1={start + GRID_SIZE * i}
                    x2={start + GRID_SIZE * i}
                    stroke="black"
                    key={i}
                />
            ));
    }

    render() {
        return <g>{this.renderVertical()}</g>;
    }
}
