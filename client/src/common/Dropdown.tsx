import React, { ReactNode } from "react";

export function Dropdown<T>({
    value,
    options,
    id,
    format
}: {
    value: T;
    options: T[];
    id: (t: T) => string;
    format: (t: T) => ReactNode;
}) {
    return (
        <div className="dropdown">
            <div className="dropdown__selected">{format(value)}</div>
            <div className="dropdown__options">
                {options.map(o => (
                    <div className="dropdown__option" key={id(o)}>
                        {format(o)}
                    </div>
                ))}
            </div>
        </div>
    );
}
