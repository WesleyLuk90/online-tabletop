import * as React from "react";

export interface Viewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

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
            this.props.onSize(svg.clientWidth, svg.clientHeight);
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
        if (this.lastMouse != null) {
            this.props.onPan(
                e.screenX - this.lastMouse.x,
                e.screenY - this.lastMouse.y
            );
            this.lastMouse = { x: e.screenX, y: e.screenY };
        }
    };

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
                <rect width={50} height={50} />
            </svg>
        );
    }
}
