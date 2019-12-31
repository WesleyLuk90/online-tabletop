import React from "react";
import "./Button.css";

export function Button({
    children,
    onClick
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}
