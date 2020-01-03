import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useState } from "react";
import { ClickAway } from "./ClickAway";
import "./Dropdown.css";
import { Icon } from "./Icon";

export function Dropdown<T>({
    value,
    options,
    id,
    format,
    onChange
}: {
    value: T;
    options: T[];
    id: (t: T) => string;
    format: (t: T) => ReactNode;
    onChange: (t: T) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <ClickAway onClickAway={() => setExpanded(false)}>
            <div className="dropdown">
                <div
                    className="dropdown__selected"
                    onClick={e => {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }}
                >
                    <div className="dropdown__content">{format(value)}</div>
                    <Icon icon={faCaretDown} />
                </div>
                {expanded && (
                    <div className="dropdown__options">
                        {options.map(o => (
                            <div
                                className="dropdown__option"
                                key={id(o)}
                                onClick={e => {
                                    e.preventDefault();
                                    onChange(o);
                                    setExpanded(false);
                                }}
                            >
                                {format(o)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClickAway>
    );
}
