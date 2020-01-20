import { Scene } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import React from "react";
import { Ellipse } from "./Ellipse";
import { Rectangle } from "./Rectangle";
import { EllipseToken } from "./tokens/EllipseToken";
import { RectangleToken } from "./tokens/RectangleToken";
import { TokenCollection } from "./tokens/TokenCollection";
import { Vector } from "./Vector";

export function TokenRender({
    token,
    boundingBox
}: {
    token: Token;
    boundingBox: Rectangle;
}) {
    switch (token.data.type) {
        case "square":
            return (
                <RectangleToken
                    rect={boundingBox}
                    strokeWidth={token.data.strokeWidth}
                    strokeColor={token.data.strokeColor}
                    fillColor={token.data.fillColor}
                />
            );
        case "ellipse":
            return (
                <EllipseToken
                    ellipse={Ellipse.fromCorners(
                        boundingBox.topLeft(),
                        boundingBox.bottomRight()
                    )}
                    strokeWidth={token.data.strokeWidth}
                    strokeColor={token.data.strokeColor}
                    fillColor={token.data.fillColor}
                />
            );
    }
}

export function TokenLayer({
    tokens,
    scene,
    viewport
}: {
    tokens: TokenCollection;
    scene: Scene;
    viewport: Rectangle;
}) {
    return (
        <g>
            {scene.layers.map(layer => (
                <g key={layer.id}>
                    {tokens
                        .get(layer)
                        .map(withBoundingBox)
                        .filter(isVisible(viewport))
                        .map(([token, boundingBox]) => (
                            <TokenRender
                                token={token}
                                boundingBox={boundingBox}
                                key={token.tokenID}
                            />
                        ))}
                </g>
            ))}
        </g>
    );
}

function withBoundingBox(token: Token): [Token, Rectangle] {
    const topLeft = new Vector(token.x, token.y);
    const bottomRight = new Vector(
        token.x + token.width,
        token.y + token.height
    );
    return [token, Rectangle.fromCorners(topLeft, bottomRight)];
}

function isVisible(viewport: Rectangle) {
    return ([token, boundingBox]: [Token, Rectangle]) =>
        viewport.overlaps(boundingBox);
}
