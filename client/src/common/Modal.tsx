import React, { ReactNode } from "react";
import { BemBuilder } from "../util/BemBuilder";
import { Button } from "./Button";
import "./Modal.css";

const BEM = new BemBuilder("modal");

export function Modal({
    visible,
    children,
    title
}: {
    visible?: boolean;
    children: ReactNode;
    title: ReactNode;
}) {
    return (
        <div className={BEM.block("visible", visible !== false)}>
            <div className={BEM.element("content")}>
                <div className="modal__header">{title}</div>
                {children}
            </div>
        </div>
    );
}

export function ModalForm({
    visible,
    children,
    title,
    onSave,
    onCancel
}: {
    visible?: boolean;
    children: ReactNode;
    title: ReactNode;
    onSave: () => Promise<void>;
    onCancel: () => void;
}) {
    function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSave();
    }
    return (
        <Modal visible={visible} title={title}>
            <form onSubmit={handleSave} className="modal-form">
                <div className="modal-form__content">{children}</div>
                <div className="modal-form__footer">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSave}>Save</Button>
                </div>
            </form>
        </Modal>
    );
}
