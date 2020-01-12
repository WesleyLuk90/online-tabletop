import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Layer } from "protocol/src/Scene";
import React, { useState } from "react";
import { Button } from "../common/Button";
import { IconButton } from "../common/IconButton";
import { ItemList } from "../common/ItemList";
import { SidePanel } from "../common/SidePanel";
import { LayerEditor } from "./LayerEditor";
import "./LayersPanel.css";
import { SceneService } from "./SceneService";

export function LayersPanel({
    layers,
    onUpdate,
    onCreate,
    onDelete
}: {
    layers: Layer[];
    onUpdate: (layer: Layer) => void;
    onCreate: (layer: Layer) => void;
    onDelete: (layer: Layer) => void;
}) {
    const [edit, setEdit] = useState<Layer | null>(null);
    const [isNew, setIsNew] = useState(false);

    return (
        <SidePanel header="Layers">
            <LayerEditor
                layer={edit}
                onUpdate={setEdit}
                onCancel={() => setEdit(null)}
                onSave={l => {
                    if (isNew) {
                        onCreate(l);
                    } else {
                        onUpdate(l);
                    }
                    setEdit(null);
                }}
                onDelete={l => {
                    onDelete(l);
                    setEdit(null);
                }}
                isNew={isNew}
            />
            <ItemList
                data={layers}
                left={l => l.name}
                id={l => l.id}
                right={l => (
                    <div className="layers-panel__actions">
                        <IconButton
                            icon={faEye}
                            inactive={!l.playerVisible}
                            onClick={() =>
                                onUpdate({
                                    ...l,
                                    playerVisible: !l.playerVisible
                                })
                            }
                        />
                        <IconButton
                            icon={faPencilAlt}
                            onClick={() => {
                                setEdit(l);
                                setIsNew(false);
                            }}
                        />
                    </div>
                )}
            />
            <Button
                onClick={() => {
                    setEdit(SceneService.createDefaultLayer());
                    setIsNew(true);
                }}
            >
                New Layer
            </Button>
        </SidePanel>
    );
}
