import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { IconButton } from "./IconButton";
import "./Search.css";

export function Search({
    value,
    onChange
}: {
    value: string;
    onChange: (newValue: string) => void;
}) {
    return (
        <div className="search">
            <input
                className="search__input"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Search"
            />
            {value !== "" && (
                <div className="search__icon">
                    <IconButton
                        icon={faTimesCircle}
                        onClick={() => onChange("")}
                    />
                </div>
            )}
        </div>
    );
}

export function defaultSearch({
    needle,
    haystack
}: {
    needle: string;
    haystack: string;
}) {
    return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}
