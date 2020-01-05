import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

export function Button({
    children,
    onClick
}: {
    children: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            className="button"
            onClick={e => {
                e.preventDefault();
                onClick();
            }}
        >
            {children}
        </button>
    );
}

export function ButtonLink({
    children,
    to
}: {
    children: ReactNode;
    to: string;
}) {
    return (
        <Link to={to} className="button">
            {children}
        </Link>
    );
}

export function ConfirmButton({
    children,
    prompt,
    onClick
}: {
    children: ReactNode;
    prompt: string;
    onClick: () => void;
}) {
    return (
        <button
            className="button"
            onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(prompt)) {
                    onClick();
                }
            }}
        >
            {children}
        </button>
    );
}
