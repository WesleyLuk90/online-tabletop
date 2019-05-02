import * as React from "react";
import { Grid } from "./Grid";
import { Viewport } from "./Viewport";

interface Position {
    x: number;
    y: number;
}

interface Props {
    viewport: Viewport;
    onSize: (width: number, height: number) => void;
    onPan: (x: number, y: number) => void;
}

export class PlayArea extends React.Component<Props> {
    svgRef = React.createRef<SVGSVGElement>();

    componentDidMount() {
        const svg = this.svgRef.current;
        if (svg) {
            const rect = svg.getBoundingClientRect();
            this.props.onSize(rect.width, rect.height);
        }
    }

    computeViewBox() {
        const { x, y, width, height } = this.props.viewport;
        return `${x - width / 2} ${y - height / 2} ${width} ${height}`;
    }

    lastMouse: Position | null = null;
    onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button === 2) {
            this.lastMouse = { x: e.screenX, y: e.screenY };
        }
    };

    onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        this.dispatchMouseMove(e.screenX, e.screenY);
    };

    animationFrame: number = 0;
    dispatchMouseMove(x: number, y: number) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => {
            if (this.lastMouse != null) {
                this.props.onPan(x - this.lastMouse.x, y - this.lastMouse.y);
                this.lastMouse = { x: x, y };
            }
        });
    }

    onMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button === 2) {
            this.lastMouse = null;
        }
    };

    onMouseLeave = (e: React.MouseEvent) => {
        this.lastMouse = null;
    };

    render() {
        return (
            <svg
                ref={this.svgRef}
                viewBox={this.computeViewBox()}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onContextMenu={e => e.preventDefault()}
                className="play-area"
            >
                <Grid viewport={this.props.viewport} />
            </svg>
        );
    }
}
