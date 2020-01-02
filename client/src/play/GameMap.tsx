import React, { useEffect, useRef, useState } from "react";
import "./GameMap.css";
import { Vector } from "./Vector";
import { View } from "./View";

export function GameMap({ view }: { view: View }) {
    const [size, setSize] = useState(new Vector(1000, 1000));
    const container = useRef<HTMLDivElement>(null);

    const scaled = size.scale(view.zoom);
    const topLeft = view.center.subtract(scaled.scale(1 / 2));

    useEffect(() => {
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
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div className="game-map" ref={container}>
            <svg
                viewBox={`${topLeft.x} ${topLeft.y} ${scaled.x} ${scaled.y}`}
                width={size.x}
                height={size.y}
            >
                <rect width="100" height="100" x="100" y="100" />
            </svg>
        </div>
    );
}
