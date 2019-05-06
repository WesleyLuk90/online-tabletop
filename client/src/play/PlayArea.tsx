import * as React from "react";
import { Debouncer } from "./Debouncer";
import { Grid } from "./Grid";
import {
    MouseHandler,
    PanHandler,
    TokenDragHandler,
    TokenSelectionHandler
} from "./MouseHandler";
import { MouseState, Position } from "./MouseState";
import { Token } from "./protocol/Token";
import { ResizeHandler } from "./ResizeHandler";
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

interface State {
    dragSelection: Vector | null;
}

export interface PositionTransformation {
    (screen: Vector, action: (position: Position) => void): void;
}

export class PlayArea extends React.Component<Props, State> {
    handlers: MouseHandler[] = [
        new TokenSelectionHandler(this),
        new PanHandler(this),
        new TokenDragHandler(this)
    ];

    state: State = {
        dragSelection: null
    };

    svgRef = React.createRef<SVGSVGElement>();

    onResize = () => {
        const svg = this.svgRef.current;
        if (svg) {
            const rect = svg.getBoundingClientRect();
            this.props.onSize(rect.width, rect.height);
        }
    };

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

    debouncer = new Debouncer();
    updateMouse() {
        this.debouncer.debounce(() => {
            const mouseState = this.mouseState;
            if (mouseState != null) {
                this.handlers
                    .filter(h => h.canHandle(mouseState))
                    .forEach(h => h.onUpdate(mouseState));
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
        this.handlers
            .filter(h => h.canHandle(mouseState))
            .forEach(h => h.onFinish(mouseState));
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
                    new Vector(screen.x - box.left, screen.y - box.top)
                )
            )
        );
    };

    render() {
        return (
            <ResizeHandler onResize={this.onResize}>
                <svg
                    ref={this.svgRef}
                    viewBox={this.props.viewport.formatViewport()}
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
                        dragSelection={this.state.dragSelection}
                        onStartMouse={this.onStartMouse}
                        positionTransform={this.positionTransform}
                    />
                </svg>
            </ResizeHandler>
        );
    }
}
