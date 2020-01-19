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

export function GameMap({
    view,
    scene,
    tool,
    onPan
}: {
    view: View;
    scene: Scene;
    tool: Tool;
    onPan: (pan: Vector) => void;
}) {
    const [screenSize, setScreenSize] = useState(new Vector(1000, 1000));
    const [pan, setPan] = useState(new Vector(0, 0));
    const container = useRef<HTMLDivElement>(null);
    const debouncer = useRef(new Debouncer());

    useEffect(() => {
        function updateSize() {
            if (container.current == null) {
                return;
            }
            setScreenSize(
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

    const viewport = view.pan(pan).getViewport(screenSize);

    const [pos, setPos] = useState(new Vector(0, 0));

    function scaleScreenToWorld(v: Vector) {
        return v.scale(view.zoom);
    }

    return (
        <div className="game-map" ref={container}>
            <Svg
                size={screenSize}
                viewport={viewport}
                onClick={setPos}
                onRightClick={a => console.log("right click", a)}
                onDrag={(a, b) => console.log("drag", a, b)}
                onDragEnd={(a, b) => console.log("drag-end", a, b)}
                onPan={(start, current) =>
                    setPan(scaleScreenToWorld(current.subtract(start)))
                }
                onPanEnd={(start, end) => {
                    setPan(new Vector(0, 0));
                    onPan(scaleScreenToWorld(end.subtract(start)));
                }}
            >
                {pos && <rect x={pos.x} y={pos.y} width={10} height={10} />}
                <Grid viewport={viewport} scene={scene} />
                <ToolLayer tool={tool} />
            </Svg>
        </div>
    );
}
