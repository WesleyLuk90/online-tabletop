import React, { useState } from "react";
import { Alert } from "../Alert";
import { Spinner } from "../Icon";
import { Button } from "./Button";

export function Form({
    onSave,
    children
}: {
    onSave: () => Promise<void>;
    children: React.ReactNode;
}) {
    const [error, setError] = useState<Error | null>(null);
    const [saving, setSaving] = useState(false);

    async function doSave() {
        setSaving(true);
        try {
            await onSave();
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                doSave();
            }}
        >
            {children}
            {error && <Alert>{error.toString()}</Alert>}
            <Button onClick={doSave}>Save</Button>
            {saving && <Spinner />}
        </form>
    );
}
