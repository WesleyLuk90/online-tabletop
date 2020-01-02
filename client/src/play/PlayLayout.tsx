import React, { ReactNode } from "react";
import "./PlayLayout.css";

export function PlayLayout({
    main,
    right,
    bottom
}: {
    main: ReactNode;
    right: ReactNode;
    bottom: ReactNode;
}) {
    return (
        <div className="play-layout">
            <div className="play-layout__main">{main}</div>
            <div className="play-layout__right">{right}</div>
            <div className="play-layout__bottom">{bottom}</div>
        </div>
    );
}
