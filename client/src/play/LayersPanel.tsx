import { Layer } from "protocol/src/Scene";
import React from "react";
import { ItemList } from "../common/ItemList";
import { SidePanel } from "../common/SidePanel";

export function LayersPanel({ layers }: { layers: Layer[] }) {
    return (
        <SidePanel header="Layers">
            <ItemList data={layers} left={l => l.name} id={l => l.id} />
        </SidePanel>
    );
}
