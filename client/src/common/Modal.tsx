import React, { ReactNode } from "react";
import { BemBuilder } from "../util/BemBuilder";
import "./Modal.css";

const BEM = new BemBuilder("modal");

export function Modal({
    visible,
    children,
    title
}: {
    visible: boolean;
    children: ReactNode;
    title: ReactNode;
}) {
    return (
        <div className={BEM.block("visible", visible)}>
            <div className={BEM.element("content")}>
                <div className="modal__header">{title}</div>
                {children}
            </div>
        </div>
    );
}
