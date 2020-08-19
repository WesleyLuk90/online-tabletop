import { Scene } from "engine/models/Scene";
import React from "react";
import { Ellipse } from "../Ellipse";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { EllipseToken } from "./EllipseToken";
import { RenderableToken } from "./RenderableToken";
import { TokenCollection } from "./TokenCollection";
import { TokenSelection } from "./TokenSelection";

export function TokenRender({ token }: { token: RenderableToken }) {
    const data = token.token.data;
    switch (data.type) {
        case "square":
            return (
                <SvgRect
                    rect={token.boundingBox}
                    strokeWidth={data.strokeWidth}
                    strokeColor={data.strokeColor}
                    fillColor={data.fillColor}
                />
            );
        case "ellipse":
            return (
                <EllipseToken
                    ellipse={Ellipse.fromCorners(
                        token.boundingBox.topLeft(),
                        token.boundingBox.bottomRight()
                    )}
                    strokeWidth={data.strokeWidth}
                    strokeColor={data.strokeColor}
                    fillColor={data.fillColor}
                />
            );
    }
}

export function TokenLayer({
    tokens,
    scene,
    viewport,
    selection,
}: {
    tokens: TokenCollection;
    scene: Scene;
    viewport: Rectangle;
    selection: TokenSelection;
}) {
    return (
        <g>
            {scene.layers.map((layer) => (
                <g key={layer.id}>
                    {tokens
                        .byLayer(layer)
                        .filter((t) => !selection.has(t))
                        .map(RenderableToken.fromToken)
                        .filter(isVisible(viewport))
                        .map((token) => (
                            <TokenRender
                                token={token}
                                key={token.token.tokenID}
                            />
                        ))}
                </g>
            ))}
        </g>
    );
}

function isVisible(viewport: Rectangle) {
    return (token: RenderableToken) => viewport.overlaps(token.boundingBox);
}
