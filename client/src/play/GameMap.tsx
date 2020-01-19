import { Scene } from "protocol/src/Scene";
import React, { useEffect, useRef, useState } from "react";
import { Debouncer } from "./Debouncer";
import "./GameMap.css";
import { Grid } from "./Grid";
import { Svg } from "./Svg";
import { ToolLayer } from "./ToolLayer";
import { Tool } from "./Tools";
import { Vector } from "./Vector";
import { View } from "./View";
import { Viewport } from "./Viewport";

export function GameMap({
    view,
    scene,
    tool
}: {
    view: View;
    scene: Scene;
    tool: Tool;
}) {
    const [size, setSize] = useState(new Vector(1000, 1000));
    const container = useRef<HTMLDivElement>(null);
    const debouncer = useRef(new Debouncer());

    useEffect(() => {
        function updateSize() {
            if (container.current == null) {
                return;
            }
            setSize(
                new Vector(
                    container.current.clientWidth,
                    container.current.clientHeight
                )
            );
        }
        updateSize();
        function updateDebounced() {
            debouncer.current.debounce(updateSize);
        }
        window.addEventListener("resize", updateDebounced);
        return () => window.removeEventListener("resize", updateDebounced);
    }, []);

    const scaled = size.scale(view.zoom);
    const topLeft = view.center.subtract(scaled.scale(1 / 2));
    const viewport = new Viewport(
        topLeft.x,
        topLeft.y,
        topLeft.x + scaled.x,
        topLeft.y + scaled.y
    );

    const [pos, setPos] = useState(new Vector(0, 0));

    return (
        <div className="game-map" ref={container}>
            <Svg
                size={size}
                viewport={viewport}
                onClick={setPos}
                onDrag={(a, b) => console.log("drag", a, b)}
                onDragEnd={(a, b) => console.log("drag-end", a, b)}
            >
                {pos && <rect x={pos.x} y={pos.y} width={10} height={10} />}
                <Grid viewport={viewport} scene={scene} />
                <ToolLayer tool={tool} />
            </Svg>
        </div>
    );
}
