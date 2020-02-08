import React, { ReactNode, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { BemBuilder } from "../../util/BemBuilder";
import { Button } from "./Button";
import "./Modal.css";

const BEM = new BemBuilder("modal");

const ModalContext = React.createContext<HTMLDivElement | null>(null);

export function ModalContainer({ children }: { children: ReactNode }) {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const setRef = useCallback(setElement, []);
    return (
        <ModalContext.Provider value={element}>
            <div ref={setRef}></div>
            {children}
        </ModalContext.Provider>
    );
}

export function Modal({
    visible,
    children,
    title
}: {
    visible?: boolean;
    children: ReactNode;
    title: ReactNode;
}) {
    const modalContext = useContext(ModalContext);
    if (modalContext != null) {
        return createPortal(
            <div className={BEM.block("visible", visible !== false)}>
                <div className={BEM.element("content")}>
                    <div className="modal__header">{title}</div>
                    {children}
                </div>
            </div>,
            modalContext
        );
    } else {
        console.warn("No modal container found");
        return null;
    }
}

export function ModalForm({
    visible,
    children,
    title,
    onSave,
    onCancel,
    footer
}: {
    visible?: boolean;
    children: ReactNode;
    title: ReactNode;
    onSave: () => Promise<void>;
    onCancel: () => void;
    footer?: ReactNode;
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
                    {footer}
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSave}>Save</Button>
                </div>
            </form>
        </Modal>
    );
}
