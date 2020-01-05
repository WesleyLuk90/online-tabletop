import { Scene } from "protocol/src/Scene";
import React from "react";
import { Dropdown } from "../common/Dropdown";
import "./SceneSelector.css";

function SceneOption({ scene }: { scene: Scene | null }) {
    if (scene == null) {
        return <div>No Scene</div>;
    }
    return <div>{scene.name}</div>;
}

export function SceneSelector({
    scene,
    scenes,
    onSelect
}: {
    scene: Scene | null;
    scenes: Scene[];
    onSelect: (sceneID: string) => void;
}) {
    return (
        <div className="scene-selector">
            <div>Scene</div>
            <div className="scene-selector__dropdown">
                <Dropdown
                    value={scene}
                    options={scenes}
                    id={s => (s && s.sceneID) || ""}
                    format={s => <SceneOption scene={s} />}
                    onChange={s => s != null && onSelect(s.sceneID)}
                />
            </div>
        </div>
    );
}
