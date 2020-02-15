import React, { useEffect, useState } from "react";
import "./Input.css";

export function Input({
    value,
    onChange
}: {
    value: string;
    onChange: (newValue: string) => void;
}) {
    const [text, setText] = useState(value);

    useEffect(() => setText(value), [value]);

    function onBlur() {
        onChange(text);
        setText(value);
    }

    return (
        <input
            className="input__input"
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={onBlur}
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
