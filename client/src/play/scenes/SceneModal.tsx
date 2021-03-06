import { Scene } from "engine/engine/models/Scene";
import React from "react";
import { ConfirmButton } from "../../common/controls/Button";
import { ModalForm } from "../../common/controls/Modal";
import { SceneForm } from "./SceneForm";

export function SceneModal({
    scene,
    onDelete,
    onCancel,
    onSave,
    onChange,
    isNew,
}: {
    scene: Scene | null;
    onChange: (scene: Scene) => void;
    onDelete: (scene: Scene) => void;
    onCancel: () => void;
    onSave: (scene: Scene) => Promise<void>;
    isNew: boolean;
}) {
    return (
        <ModalForm
            visible={scene != null}
            title="Edit Scene"
            onCancel={onCancel}
            onSave={async () => {
                if (scene) onSave(scene);
            }}
            footer={
                !isNew && (
                    <ConfirmButton
                        prompt="Are you sure you want to delete this scene?"
                        onClick={() => {
                            if (scene != null) {
                                onDelete(scene);
                            }
                        }}
                    >
                        Delete
                    </ConfirmButton>
                )
            }
        >
            {scene && <SceneForm scene={scene} onChange={onChange} />}
        </ModalForm>
    );
}
