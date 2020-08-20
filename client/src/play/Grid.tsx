import { Scene } from "engine/engine/models/Scene";
import { Rectangle } from "engine/src/math/Rectangle";
import React from "react";
import { range } from "../util/Range";
import "./Grid.css";

export function Line({
    x1,
    x2,
    y1,
    y2,
}: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}) {
    return <line className="grid__line" x1={x1} x2={x2} y1={y1} y2={y2} />;
}

export function Grid({
    scene,
    viewport,
}: {
    scene: Scene;
    viewport: Rectangle;
}) {
    const startX = Math.floor(viewport.left / scene.gridSize);
    const endX = Math.ceil(viewport.right / scene.gridSize);
    const startY = Math.floor(viewport.top / scene.gridSize);
    const endY = Math.ceil(viewport.bottom / scene.gridSize);

    if (endX - startX > 150 || endY - startY > 150) {
        return null;
    }

    return (
        <g>
            {range(startX, endX).map((i) => (
                <Line
                    key={i}
                    x1={i * scene.gridSize}
                    x2={i * scene.gridSize}
                    y1={viewport.top}
                    y2={viewport.bottom}
                />
            ))}
            {range(startY, endY).map((i) => (
                <Line
                    key={i}
                    x1={viewport.left}
                    x2={viewport.right}
                    y1={i * scene.gridSize}
                    y2={i * scene.gridSize}
                />
            ))}
        </g>
    );
}
