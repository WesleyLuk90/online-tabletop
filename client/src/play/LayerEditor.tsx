import { Layer } from "protocol/src/Scene";
import React from "react";
import { ConfirmButton } from "../common/Button";
import { Input } from "../common/Input";
import { ModalForm } from "../common/Modal";

export function LayerEditor({
    layer,
    onUpdate,
    onSave,
    onCancel,
    onDelete,
    isNew
}: {
    layer: Layer | null;
    onUpdate: (layer: Layer) => void;
    onSave: (layer: Layer) => void;
    onCancel: () => void;
    onDelete: (layer: Layer) => void;
    isNew: boolean;
}) {
    function renderForm() {
        if (layer == null) {
            return null;
        }
        return (
            <div>
                <Input
                    label="Name"
                    value={layer.name}
                    onChange={name => onUpdate({ ...layer, name })}
                />
            </div>
        );
    }

    return (
        <ModalForm
            visible={layer != null}
            title="Edit Layer"
            onSave={async () => {
                if (layer != null) {
                    onSave(layer);
                }
            }}
            onCancel={onCancel}
            footer={
                !isNew && (
                    <ConfirmButton
                        prompt="Are you sure you want to delete this layer?"
                        onClick={() => {
                            if (layer != null) {
                                onDelete(layer);
                            }
                        }}
                    >
                        Delete
                    </ConfirmButton>
                )
            }
        >
            {renderForm()}
        </ModalForm>
    );
}
