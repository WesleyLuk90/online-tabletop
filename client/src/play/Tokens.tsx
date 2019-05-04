import React from "react";
import { MouseState } from "./MouseState";
import { PositionTransformation } from "./PlayArea";
import { Token } from "./Token";
import { Vector, Viewport } from "./Viewport";

interface Props {
    viewport: Viewport;
    tokens: Token[];
    selected: string[];
    onStartMouse: (m: MouseState) => void;
    positionTransform: PositionTransformation;
}

const SELECTION_COLOR = "rgb(45, 116, 229)";

export class Tokens extends React.Component<Props> {
    onMouseDown(token: Token, e: React.MouseEvent) {
        this.props.positionTransform(Vector.fromMouseEvent(e), position => {
            e.stopPropagation();
            this.props.onStartMouse(
                new MouseState(token.id, e.button, position)
            );
        });
    }

    renderToken(token: Token) {
        const render = [
            <rect
                key={token.id}
                x={token.x}
                y={token.y}
                width={token.width}
                height={token.height}
                onMouseDown={e => this.onMouseDown(token, e)}
            />
        ];
        if (this.props.selected.includes(token.id)) {
            render.push(
                <path
                    key={token.id + "selection-line"}
                    stroke={SELECTION_COLOR}
                    strokeWidth="3"
                    d={`M ${token.x},${token.y} v ${token.height} h ${
                        token.width
                    } v ${-token.height} h ${-token.width}`}
                />
            );
        }
        return render;
    }

    render() {
        return <g>{this.props.tokens.map(t => this.renderToken(t))}</g>;
    }
}
