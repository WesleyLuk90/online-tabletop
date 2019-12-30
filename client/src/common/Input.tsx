import React, { ReactNode } from "react";

export function Input({
    value,
    onChange,
    label
}: {
    value: string;
    onChange: (newValue: string) => {};
    label: ReactNode;
}) {
    return (
        <div>
            <label>{label}</label>
            <input value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}
