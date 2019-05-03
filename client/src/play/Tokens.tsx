import React from "react";
import { Token } from "./Token";

interface Props {
    tokens: Token[];
    selected: string[];
    onClick: (t: Token) => void;
}

const SELECTION_COLOR = "rgb(45, 116, 229)";

export class Tokens extends React.Component<Props> {
    renderToken(token: Token) {
        const render = [
            <rect
                key={token.id}
                x={token.x}
                y={token.y}
                width={token.width}
                height={token.height}
                onClick={() => this.props.onClick(token)}
            />
        ];
        console.log(this.props.selected);
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
