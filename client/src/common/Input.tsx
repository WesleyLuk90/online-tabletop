import React, { ReactNode, useEffect, useState } from "react";
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

export function NumberInput({
    value,
    onChange,
    label
}: {
    value: number;
    onChange: (newValue: number) => void;
    label: ReactNode;
}) {
    const [stringValue, setStringValue] = useState(value.toString());

    useEffect(() => {
        setStringValue(value.toString());
    }, [value]);

    function updateValue() {
        const parsed = parseInt(stringValue, 10);
        if (isNaN(parsed)) {
            setStringValue(value.toString());
        } else {
            onChange(parsed);
        }
    }

    return (
        <div className="input">
            <label className="input__label">{label}</label>
            <input
                className="input__input"
                type="number"
                value={stringValue}
                onChange={e => setStringValue(e.target.value)}
                onBlur={updateValue}
            />
        </div>
    );
}
