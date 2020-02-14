import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Layer } from "protocol/src/Scene";
import React, { useState } from "react";
import { Button } from "../common/controls/Button";
import { ColorSquare } from "../common/controls/ColorSquare";
import { IconButton } from "../common/controls/IconButton";
import { ItemList } from "../common/controls/ItemList";
import { SidePanel } from "../common/layout/SidePanel";
import { BemBuilder } from "../util/BemBuilder";
import { replaceValue } from "../util/List";
import { DispatchGameEvent } from "./gamestate/events/GameEvent";
import {
    RequestUpdateSceneLayers,
    RequestUpdateSceneLayerVisibility
} from "./gamestate/events/LayerRequests";
import { UpdateActiveLayer } from "./gamestate/events/UpdateActiveLayer";
import { LayerEditor } from "./LayerEditor";
import "./LayersPanel.css";
import { SceneService } from "./SceneService";

const BEM = new BemBuilder("layers-panel");

export function LayersPanel({
    sceneID,
    layers,
    activeLayer,
    dispatch
}: {
    sceneID: string;
    layers: Layer[];
    activeLayer: Layer | null;
    dispatch: DispatchGameEvent;
}) {
    const [edit, setEdit] = useState<Layer | null>(null);
    const [isNew, setIsNew] = useState(false);

    function onMove(from: number, to: number) {
        const copy = layers.slice();
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
        dispatch(new RequestUpdateSceneLayers(sceneID, copy));
    }

    return (
        <SidePanel header="Layers">
            <LayerEditor
                layer={edit}
                onUpdate={setEdit}
                onCancel={() => setEdit(null)}
                onSave={newLayer => {
                    if (isNew) {
                        dispatch(
                            new RequestUpdateSceneLayers(sceneID, [
                                ...layers,
                                newLayer
                            ])
                        );
                    } else {
                        dispatch(
                            new RequestUpdateSceneLayers(
                                sceneID,
                                replaceValue(
                                    layers,
                                    l => l.id === newLayer.id,
                                    () => newLayer
                                )
                            )
                        );
                    }
                    setEdit(null);
                }}
                onDelete={toDelete => {
                    dispatch(
                        new RequestUpdateSceneLayers(
                            sceneID,
                            layers.filter(l => l.id !== toDelete.id)
                        )
                    );
                    setEdit(null);
                }}
                isNew={isNew}
            />
            <ItemList
                data={layers}
                left={l => (
                    <div
                        onClick={() => dispatch(new UpdateActiveLayer(l))}
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
                                dispatch(
                                    new RequestUpdateSceneLayerVisibility(
                                        sceneID,
                                        l.id,
                                        !l.playerVisible
                                    )
                                )
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
