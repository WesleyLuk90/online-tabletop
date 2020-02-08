import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Layer } from "protocol/src/Scene";
import React, { useState } from "react";
import { ColorSquare } from "../common/controls/ColorSquare";
import { IconButton } from "../common/controls/IconButton";
import { ItemList } from "../common/controls/ItemList";
import { Button } from "../common/forms/Button";
import { SidePanel } from "../common/layout/SidePanel";
import { BemBuilder } from "../util/BemBuilder";
import { LayerEditor } from "./LayerEditor";
import "./LayersPanel.css";
import { SceneService } from "./SceneService";

const BEM = new BemBuilder("layers-panel");

export function LayersPanel({
    layers,
    onUpdate,
    onCreate,
    onDelete,
    onSort,
    activeLayer,
    onChangeActiveLayer
}: {
    layers: Layer[];
    onUpdate: (layer: Layer) => void;
    onCreate: (layer: Layer) => void;
    onDelete: (layer: Layer) => void;
    onSort: (layers: Layer[]) => void;
    activeLayer: Layer | null;
    onChangeActiveLayer: (layer: Layer) => void;
}) {
    const [edit, setEdit] = useState<Layer | null>(null);
    const [isNew, setIsNew] = useState(false);

    function onMove(from: number, to: number) {
        const copy = layers.slice();
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
        onSort(copy);
    }

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
                left={l => (
                    <div
                        onClick={() => onChangeActiveLayer(l)}
                        className={BEM.element(
                            "layer",
                            "active",
                            activeLayer != null && activeLayer.id === l.id
                        )}
                    >
                        <ColorSquare color={l.color} />
                        {l.name}
                    </div>
                )}
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
                            title="Player Visible"
                        />
                        <IconButton
                            icon={faPencilAlt}
                            onClick={() => {
                                setEdit(l);
                                setIsNew(false);
                            }}
                            title="Edit Layer"
                        />
                    </div>
                )}
                onMove={onMove}
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
