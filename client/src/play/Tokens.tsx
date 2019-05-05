import React from "react";
import { MouseState } from "./MouseState";
import { PositionTransformation } from "./PlayArea";
import { Token } from "./protocol/Token";
import { Vector, Viewport } from "./Viewport";

interface Props {
    viewport: Viewport;
    tokens: Token[];
    selected: string[];
    dragSelection: Vector | null;
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
        const isSelected = this.props.selected.includes(token.id);
        let x = token.x;
        let y = token.y;
        if (isSelected && this.props.dragSelection) {
            x += this.props.dragSelection.x;
            y += this.props.dragSelection.y;
        }
        const render = [
            <rect key={token.id} width={token.width} height={token.height} />
        ];
        if (isSelected) {
            render.push(
                <path
                    key={token.id + "selection-line"}
                    stroke={SELECTION_COLOR}
                    strokeWidth="3"
                    d={`M 0,0 v ${token.height} h ${
                        token.width
                    } v ${-token.height} h ${-token.width}`}
                />
            );
        }
        return (
            <g
                key={token.id}
                onMouseDown={e => this.onMouseDown(token, e)}
                transform={`translate(${x}, ${y})`}
            >
                {render}
            </g>
        );
    }

    render() {
        return <g>{this.props.tokens.map(t => this.renderToken(t))}</g>;
    }
}
