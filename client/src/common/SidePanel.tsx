import React, { ReactNode, useState } from "react";
import { ExpandToggle } from "./ExpandToggle";
import "./SidePanel.css";

export function SidePanel({
    header,
    children
}: {
    header: ReactNode;
    children: ReactNode;
}) {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className="side-panel">
            <div
                className="side-panel__header"
                onClick={e => {
                    e.preventDefault();
                    setExpanded(!expanded);
                }}
            >
                <div className="side-panel__header-content">{header}</div>
                <ExpandToggle expanded={expanded} />
            </div>
            <div
                className={`side-panel__content ${expanded &&
                    "side-panel__content--expanded"}`}
            >
                {children}
            </div>
        </div>
    );
}
