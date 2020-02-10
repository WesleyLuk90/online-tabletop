import React, { useEffect, useState } from "react";
import { BemBuilder } from "../../util/BemBuilder";
import { Callback } from "../../util/Callback";
import "./NumberSpinner.css";

const BEM = new BemBuilder("number-spinner");

export function NumberSpinner({
    value,
    onChange,
    label
}: {
    value: number;
    onChange: Callback<number>;
    label: string;
}) {
    const [displayedValue, setDisplayedValue] = useState(value.toString());

    useEffect(() => {
        setDisplayedValue(value.toString());
    }, [value]);

    function triggerValue() {
        const newValue = parseFloat(displayedValue);
        if (isNaN(newValue)) {
            setDisplayedValue(value.toString());
        } else {
            onChange(newValue);
        }
    }

    return (
        <div className={BEM.block()}>
            <div className={BEM.element("label")}>{label}</div>
            <button className={BEM.element("button")}>-</button>
            <input
                value={displayedValue}
                onChange={e => setDisplayedValue(e.target.value)}
                onBlur={triggerValue}
                type="number"
                className={BEM.element("value")}
            />
            <button className={BEM.element("button")}>+</button>
        </div>
    );
}
