import React, { ReactNode } from "react";
import "./Input.css";

export function Label({
    label,
    children
}: {
    label: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="input">
            <label className="input__label">{label}</label>
            {children}
        </div>
    );
}
