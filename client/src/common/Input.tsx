import React, { ReactNode, useEffect, useState } from "react";
import "./Input.css";
import { Label } from "./Label";

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
        <Label label={label}>
            <input
                className="input__input"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </Label>
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
        <Label label={label}>
            <input
                className="input__input"
                type="number"
                value={stringValue}
                onChange={e => setStringValue(e.target.value)}
                onBlur={updateValue}
            />
        </Label>
    );
}
