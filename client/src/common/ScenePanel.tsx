import { Scene } from "protocol/src/Scene";
import React from "react";
import { SceneSelector } from "../play/SceneSelector";
import { SidePanel } from "./SidePanel";

export function ScenePanel({
    myScene,
    defaultScene,
    scenes,
    onChangeScene,
    onChangeDefaultScene
}: {
    myScene: string;
    defaultScene: string;
    scenes: Scene[];
    onChangeScene: (sceneID: string) => void;
    onChangeDefaultScene: (sceneID: string) => void;
}) {
    return (
        <SidePanel header="Scenes">
            <SceneSelector
                scenes={scenes}
                scene={scenes.find(s => s.sceneID == myScene) || null}
                onSelect={onChangeScene}
            />
        </SidePanel>
    );
}
