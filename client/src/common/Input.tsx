import React, { ReactNode } from "react";
import "./Input.css";

export function Input({
    value,
    onChange,
    label
}: {
    value: string;
    onChange: (newValue: string) => void;
    label: ReactNode;
}) {
    return (
        <div className="input">
            <label className="input__label">{label}</label>
            <input
                className="input__input"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
