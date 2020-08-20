import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Layer } from "engine/src/engine/models/Layer";
import React, { useState } from "react";
import { Button } from "../common/controls/Button";
import { ColorSquare } from "../common/controls/ColorSquare";
import { IconButton } from "../common/controls/IconButton";
import { ItemList } from "../common/controls/ItemList";
import { SidePanel } from "../common/layout/SidePanel";
import { BemBuilder } from "../util/BemBuilder";
import { LayerEditor } from "./LayerEditor";
import "./LayersPanel.css";

const BEM = new BemBuilder("layers-panel");

export function LayersPanel({
    sceneID,
    layers,
    activeLayer,
    dispatch,
}: {
    sceneID: string;
    layers: Layer[];
    activeLayer: Layer | null;
    dispatch: (a: any) => {};
}) {
    const [edit, setEdit] = useState<Layer | null>(null);
    const [isNew, setIsNew] = useState(false);

    function onMove(from: number, to: number) {
        const copy = layers.slice();
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
    }

    return (
        <SidePanel header="Layers">
            <LayerEditor
                layer={edit}
                onUpdate={setEdit}
                onCancel={() => setEdit(null)}
                onSave={(newLayer) => {
                    if (isNew) {
                    } else {
                    }
                    setEdit(null);
                }}
                onDelete={(toDelete) => {
                    setEdit(null);
                }}
                isNew={isNew}
            />
            <ItemList
                data={layers}
                left={(l) => (
                    <div
                        onClick={() => {}}
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
                id={(l) => l.id}
                right={(l) => (
                    <div className="layers-panel__actions">
                        <IconButton
                            icon={faEye}
                            inactive={!l.playerVisible}
                            onClick={() => {}}
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
                    setIsNew(true);
                }}
            >
                New Layer
            </Button>
        </SidePanel>
    );
}
