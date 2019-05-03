import * as React from "react";
import { Grid } from "./Grid";
import { Token } from "./Token";
import { Tokens } from "./Tokens";
import { Position, toWorldCoordinates, Viewport } from "./Viewport";

interface MouseState {
    button: number;
    position: Position;
}

interface Props {
    viewport: Viewport;
    tokens: Token[];
    selected: string[];
    onSize: (width: number, height: number) => void;
    onPan: (dx: number, dy: number) => void;
    onSelect: (tokens: string[]) => void;
    onDrag: (position: Position) => void;
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

    mouseState: MouseState | null = null;
    onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        this.mouseState = {
            button: e.button,
            position: { x: e.screenX, y: e.screenY }
        };
    };

    onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        this.dispatchMouseMove(e.screenX, e.screenY);
    };

    animationFrame: number = 0;
    dispatchMouseMove(x: number, y: number) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => {
            if (this.mouseState != null) {
                const { button, position } = this.mouseState;
                if (button === 2) {
                    this.props.onPan(position.x - x, position.y - y);
                } else if (button === 0 && this.svgRef.current !== null) {
                    const box = this.svgRef.current.getBoundingClientRect();
                    this.props.onDrag(
                        toWorldCoordinates(this.props.viewport, {
                            x: box.left - x,
                            y: box.right - y
                        })
                    );
                }
                this.mouseState = { button, position: { x, y } };
            }
        });
    }

    onMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
        this.mouseState = null;
    };

    onMouseLeave = (e: React.MouseEvent) => {
        this.mouseState = null;
    };

    onClick = (token: Token) => {
        this.props.onSelect([token.id]);
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
                <Tokens
                    tokens={this.props.tokens}
                    selected={this.props.selected}
                    onClick={this.onClick}
                />
            </svg>
        );
    }
}
