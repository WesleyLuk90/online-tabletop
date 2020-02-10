import React, { ReactNode } from "react";
import { Input, NumberInput } from "./Input";
import { Label } from "./Label";

export function TextFormControl({
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
            <Input value={value} onChange={onChange} />
        </Label>
    );
}

export function NumberFormControl({
    value,
    onChange,
    label
}: {
    value: number;
    onChange: (newValue: number) => void;
    label: ReactNode;
}) {
    return (
        <Label label={label}>
            <NumberInput value={value} onChange={onChange} />
        </Label>
    );
}
