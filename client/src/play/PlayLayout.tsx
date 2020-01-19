import React, { ReactNode } from "react";
import "./PlayLayout.css";

export function PlayLayout({
    main,
    right,
    bottom,
    toolbar
}: {
    main: ReactNode;
    right: ReactNode;
    bottom: ReactNode;
    toolbar: ReactNode;
}) {
    return (
        <div className="play-layout">
            <div className="play-layout__main">{main}</div>
            <div className="play-layout__right">{right}</div>
            <div className="play-layout__bottom">{bottom}</div>
            <div className="play-layout__toolbar">{toolbar}</div>
        </div>
    );
}
