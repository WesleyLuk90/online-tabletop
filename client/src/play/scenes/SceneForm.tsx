import { Scene } from "protocol/src/Scene";
import React from "react";
import {
    NumberFormControl,
    TextFormControl
} from "../../common/controls/TextFormControl";

export function SceneForm({
    scene,
    onChange
}: {
    scene: Scene;
    onChange: (scene: Scene) => void;
}) {
    return (
        <div>
            <TextFormControl
                label="Name"
                value={scene.name}
                onChange={name => onChange({ ...scene, name })}
            />
            <NumberFormControl
                label="Grid Size"
                value={scene.gridSize}
                onChange={gridSize => onChange({ ...scene, gridSize })}
            />
        </div>
    );
}
