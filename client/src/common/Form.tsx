import React, { useState } from "react";
import { Alert } from "./Alert";
import { Button } from "./Button";

export function Form({
    onSave,
    children
}: {
    onSave: () => Promise<void>;
    children: React.ReactNode;
}) {
    const [error, setError] = useState<Error | null>(null);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSave().catch(setError);
            }}
        >
            {children}
            {error && <Alert>{error.toString()}</Alert>}
            <Button onClick={onSave}>Save</Button>
        </form>
    );
}
