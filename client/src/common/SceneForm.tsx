import { Scene } from "protocol/src/Scene";
import React from "react";
import { Input, NumberInput } from "./forms/Input";

export function SceneForm({
    scene,
    onChange
}: {
    scene: Scene;
    onChange: (scene: Scene) => void;
}) {
    return (
        <div>
            <Input
                label="Name"
                value={scene.name}
                onChange={name => onChange({ ...scene, name })}
            />
            <NumberInput
                label="Grid Size"
                value={scene.gridSize}
                onChange={gridSize => onChange({ ...scene, gridSize })}
            />
        </div>
    );
}
