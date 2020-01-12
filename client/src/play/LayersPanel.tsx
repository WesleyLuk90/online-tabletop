import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Layer } from "protocol/src/Scene";
import React from "react";
import { IconButton } from "../common/IconButton";
import { ItemList } from "../common/ItemList";
import { SidePanel } from "../common/SidePanel";
import "./LayersPanel.css";

export function LayersPanel({
    layers,
    onUpdate
}: {
    layers: Layer[];
    onUpdate: (layer: Layer) => void;
}) {
    return (
        <SidePanel header="Layers">
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
                        <IconButton icon={faPencilAlt} onClick={() => {}} />
                    </div>
                )}
            />
        </SidePanel>
    );
}
