import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

export function Button({
    children,
    onClick
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

export function ButtonLink({
    children,
    to
}: {
    children: React.ReactNode;
    to: string;
}) {
    return (
        <Link to={to} className="button">
            {children}
        </Link>
    );
}
