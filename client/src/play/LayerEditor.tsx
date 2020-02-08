import { Layer } from "protocol/src/Scene";
import React from "react";
import { ColorService } from "../common/ColorService";
import { ColorSquare } from "../common/controls/ColorSquare";
import { ModalForm } from "../common/controls/Modal";
import { ConfirmButton } from "../common/forms/Button";
import { Input } from "../common/forms/Input";
import { Label } from "../common/forms/Label";
import { Colors } from "./Colors";
import "./LayerEditor.css";

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
                <Label label="Color">
                    {Colors.map(c => (
                        <div
                            key={ColorService.key(c)}
                            className="layer-editor__color"
                            onClick={e => {
                                e.preventDefault();
                                onUpdate({ ...layer, color: c });
                            }}
                        >
                            <ColorSquare
                                color={c}
                                highlight={ColorService.isEqual(c, layer.color)}
                            />
                        </div>
                    ))}
                </Label>
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
