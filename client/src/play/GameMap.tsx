import { Scene } from "engine/engine/models/Scene";
import { Vector } from "engine/src/math/Vector";
import React, { useEffect, useRef, useState } from "react";
import { Debouncer } from "./Debouncer";
import "./GameMap.css";
import { Grid } from "./Grid";
import { MapContextProvider } from "./input/MapEvents";
import { Svg } from "./Svg";
import { View } from "./View";

export function GameMap({
    scene,
    dispatch,
}: {
    scene: Scene;
    dispatch: (a: any) => void;
}) {
    const [view, setView] = useState(new View(1, new Vector(0, 0)));
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

    function scaleScreenToWorld(v: Vector) {
        return v.scale(view.getScale());
    }

    return (
        <div className="game-map" ref={container}>
            <MapContextProvider>
                {({
                    onClick,
                    onRightClick,
                    onDragStart,
                    onDrag,
                    onDragEnd,
                }) => (
                    <Svg
                        size={screenSize}
                        viewport={viewport}
                        onClick={onClick}
                        onRightClick={onRightClick}
                        onDragStart={onDragStart}
                        onDrag={onDrag}
                        onDragEnd={onDragEnd}
                        onPan={(start, current) =>
                            setPan(scaleScreenToWorld(current.subtract(start)))
                        }
                        onPanEnd={(start, end) => {
                            setPan(new Vector(0, 0));
                            setView(
                                view.pan(
                                    scaleScreenToWorld(end.subtract(start))
                                )
                            );
                        }}
                        onZoom={(tick) => {
                            setView(view.zoom(1 + tick * 0.1));
                        }}
                    >
                        <Grid viewport={viewport} scene={scene} />
                    </Svg>
                )}
            </MapContextProvider>
        </div>
    );
}
