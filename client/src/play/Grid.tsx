import React from "react";
import { bottom, left, right, top, Viewport } from "./Viewport";

const GRID_SIZE = 70;

interface Props {
    viewport: Viewport;
}

const GRID_COLOR = "rgba(128,128,128,0.3)";

export class Grid extends React.Component<Props> {
    renderVertical() {
        const { x, width } = this.props.viewport;
        const y1 = top(this.props.viewport);
        const y2 = bottom(this.props.viewport);
        const start = Math.floor((x - width / 2) / GRID_SIZE) * GRID_SIZE;
        return new Array(Math.floor(width / GRID_SIZE) + 1)
            .fill(0)
            .map((a, i) => i)
            .map(i => (
                <line
                    y1={y1}
                    y2={y2}
                    x1={start + GRID_SIZE * i}
                    x2={start + GRID_SIZE * i}
                    stroke={GRID_COLOR}
                    key={i}
                />
            ));
    }

    renderHorizontal() {
        const { y, height } = this.props.viewport;
        const x1 = left(this.props.viewport);
        const x2 = right(this.props.viewport);
        const start = Math.floor((y - height / 2) / GRID_SIZE) * GRID_SIZE;
        return new Array(Math.floor(height / GRID_SIZE) + 1)
            .fill(0)
            .map((a, i) => i)
            .map(i => (
                <line
                    x1={x1}
                    x2={x2}
                    y1={start + GRID_SIZE * i}
                    y2={start + GRID_SIZE * i}
                    stroke={GRID_COLOR}
                    key={i}
                />
            ));
    }

    render() {
        return (
            <g>
                {this.renderVertical()}
                {this.renderHorizontal()}
            </g>
        );
    }
}
