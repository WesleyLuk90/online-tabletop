import { Scene } from "protocol/src/Scene";
import React, { useEffect, useRef, useState } from "react";
import { Debouncer } from "./Debouncer";
import "./GameMap.css";
import { Grid } from "./Grid";
import { Vector } from "./Vector";
import { View } from "./View";
import { Viewport } from "./Viewport";

export function GameMap({ view, scene }: { view: View; scene: Scene }) {
    const [size, setSize] = useState(new Vector(1000, 1000));
    const container = useRef<HTMLDivElement>(null);

    const scaled = size.scale(view.zoom);
    const topLeft = view.center.subtract(scaled.scale(1 / 2));
    const viewport = new Viewport(
        topLeft.x,
        topLeft.y,
        topLeft.x + scaled.x,
        topLeft.y + scaled.y
    );

    useEffect(() => {
        const debounce = new Debouncer();
        function updateSize() {
            if (container.current != null) {
                setSize(
                    new Vector(
                        container.current.clientWidth,
                        container.current.clientHeight
                    )
                );
            }
        }
        updateSize();
        function updateDebounced() {
            debounce.debounce(updateSize);
        }
        window.addEventListener("resize", updateDebounced);
        return () => window.removeEventListener("resize", updateDebounced);
    }, []);

    return (
        <div className="game-map" ref={container}>
            <svg
                viewBox={`${topLeft.x} ${topLeft.y} ${scaled.x} ${scaled.y}`}
                width={size.x}
                height={size.y}
            >
                <Grid viewport={viewport} scene={scene} />
            </svg>
        </div>
    );
}
