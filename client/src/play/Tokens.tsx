import React from "react";
import { Token } from "./Token";

interface Props {
    tokens: Token[];
}

export class Tokens extends React.Component<Props> {
    render() {
        return (
            <g>
                {this.props.tokens.map(t => (
                    <rect
                        key={t.id}
                        x={t.x}
                        y={t.y}
                        width={t.width}
                        height={t.height}
                    />
                ))}
            </g>
        );
    }
}
