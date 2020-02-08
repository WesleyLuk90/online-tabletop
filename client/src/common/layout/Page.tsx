import React, { ReactNode } from "react";
import "./Page.css";

export function Page({
    children,
    title
}: {
    children: ReactNode;
    title: ReactNode;
}) {
    return (
        <div className="page">
            <h1>{title}</h1>
            {children}
        </div>
    );
}
