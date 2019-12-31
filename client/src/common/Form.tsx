import React from "react";
import { Button } from "./Button";

export function Form({
    onSave,
    children
}: {
    onSave: () => Promise<void>;
    children: React.ReactNode;
}) {
    return (
        <form>
            {children}
            <Button onClick={onSave}>Save</Button>
        </form>
    );
}
