import * as React from "react";
import { Grid } from "./Grid";
import { Buttons, MouseState, Position } from "./MouseState";
import { ResizeHandler } from "./ResizeHandler";
import { Token } from "./Token";
import { Tokens } from "./Tokens";
import { Vector, Viewport } from "./Viewport";

interface Props {
    viewport: Viewport;
    tokens: Token[];
    selected: string[];
    onSize: (width: number, height: number) => void;
    onPan: (vector: Vector) => void;
    onSelect: (tokens: string[]) => void;
    onDrag: (position: Vector) => void;
}

export interface PositionTransformation {
    (screen: Vector, action: (position: Position) => void): void;
}

export class PlayArea extends React.Component<Props> {
    svgRef = React.createRef<SVGSVGElement>();

    onResize = () => {
        const svg = this.svgRef.current;
        if (svg) {
            const rect = svg.getBoundingClientRect();
            this.props.onSize(rect.width, rect.height);
        }
    };

    computeViewBox() {
        const { x, y, width, height } = this.props.viewport;
        return `${x - width / 2} ${y - height / 2} ${width} ${height}`;
    }

    mouseState: MouseState | null = null;
    onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        this.positionTransform(Vector.fromMouseEvent(e), position => {
            this.mouseState = new MouseState(null, e.button, position);
        });
    };

    onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        this.positionTransform(Vector.fromMouseEvent(e), position => {
            if (this.mouseState != null) {
                this.mouseState.updatePosition(position);
                this.updateMouse();
            }
        });
    };

    animationFrame: number = 0;
    updateMouse() {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => {
            if (this.mouseState != null && this.mouseState.isDrag()) {
                const button = this.mouseState.button;
                if (button === Buttons.RIGHT) {
                    this.props.onPan(this.mouseState.screenDelta().negative());
                } else if (button === Buttons.LEFT) {
                }
            }
        });
    }

    onMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
        this.positionTransform(Vector.fromMouseEvent(e), p => {
            if (this.mouseState != null) {
                this.mouseState.end(p);
                this.handleFinalMouseState(this.mouseState);
                this.mouseState = null;
            }
        });
    };

    onMouseLeave = (e: React.MouseEvent) => {
        this.positionTransform(Vector.fromMouseEvent(e), p => {
            if (this.mouseState != null) {
                this.mouseState.cancel(p);
                this.handleFinalMouseState(this.mouseState);
                this.mouseState = null;
            }
        });
    };

    handleFinalMouseState(mouseState: MouseState) {
        if (!mouseState.isDrag()) {
            if (
                mouseState.button === Buttons.LEFT &&
                mouseState.tokenId != null
            ) {
                this.props.onSelect([mouseState.tokenId]);
            }
        }
    }

    onStartMouse = (mouseState: MouseState) => {
        this.mouseState = mouseState;
    };

    positionTransform: PositionTransformation = (screen, action) => {
        if (this.svgRef.current == null) {
            return;
        }
        const box = this.svgRef.current.getBoundingClientRect();
        action(
            new Position(
                screen,
                this.props.viewport.toWorldCoordinates(
                    new Vector(box.left - screen.x, box.top - screen.y)
                )
            )
        );
    };

    render() {
        return (
            <ResizeHandler onResize={this.onResize}>
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
                        viewport={this.props.viewport}
                        tokens={this.props.tokens}
                        selected={this.props.selected}
                        onStartMouse={this.onStartMouse}
                        positionTransform={this.positionTransform}
                    />
                </svg>
            </ResizeHandler>
        );
    }
}
