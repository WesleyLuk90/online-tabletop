import React from "react";
import { Viewport } from "./Viewport";

const GRID_SIZE = 70;

interface Props {
    viewport: Viewport;
}

const GRID_COLOR = "rgba(128,128,128,0.3)";

function range(to: number): number[] {
    return new Array(to).fill(0).map((a, i) => i);
}

export class Grid extends React.Component<Props> {
    renderVertical() {
        const viewport = this.props.viewport;
        const y1 = viewport.top();
        const y2 = viewport.bottom();
        const start =
            Math.ceil((viewport.x - viewport.width / 2) / GRID_SIZE) *
            GRID_SIZE;
        return range(Math.floor(viewport.width / GRID_SIZE) + 1).map(i => (
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
        const viewport = this.props.viewport;
        const x1 = viewport.left();
        const x2 = viewport.right();
        const start =
            Math.ceil((viewport.y - viewport.height / 2) / GRID_SIZE) *
            GRID_SIZE;
        return range(Math.floor(viewport.height / GRID_SIZE) + 1).map(i => (
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
