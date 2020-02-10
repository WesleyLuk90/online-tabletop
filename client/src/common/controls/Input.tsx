import React, { useEffect, useState } from "react";
import "./Input.css";

export function Input({
    value,
    onChange
}: {
    value: string;
    onChange: (newValue: string) => void;
}) {
    return (
        <input
            className="input__input"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
}

export function NumberInput({
    value,
    onChange
}: {
    value: number;
    onChange: (newValue: number) => void;
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
            setStringValue(value.toString());
        }
    }

    return (
        <input
            className="input__number-input"
            type="number"
            value={stringValue}
            onChange={e => setStringValue(e.target.value)}
            onBlur={updateValue}
        />
    );
}
