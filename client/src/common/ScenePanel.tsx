import {
    faEye,
    faLocationArrow,
    faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import { Scene } from "protocol/src/Scene";
import React from "react";
import { plural } from "../util/Plural";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import "./ScenePanel.css";
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
            {scenes.map(s => (
                <div key={s.sceneID} className="scene-panel__scene-option">
                    <div className="scene-panel__name">{s.name}</div>
                    <div className="scene-panel__action">
                        <IconButton
                            inactive={s.sceneID !== myScene}
                            icon={faLocationArrow}
                            onClick={() => onChangeScene(s.sceneID)}
                            title="Active Scene"
                        />
                    </div>
                    <div className="scene-panel__action">
                        <IconButton
                            inactive={s.sceneID !== defaultScene}
                            icon={faEye}
                            onClick={() => onChangeDefaultScene(s.sceneID)}
                            title="Editing Scene"
                        />
                    </div>
                    <div className="scene-panel__action">
                        <IconButton
                            icon={faPencilAlt}
                            onClick={() => {}}
                            title="Editing Scene"
                        />
                    </div>
                </div>
            ))}
            <div className="scene-panel__footer">
                <p>
                    {scenes.length} {plural(scenes.length, "scene")}
                </p>
                <Button onClick={() => {}}>New Scene</Button>
            </div>
        </SidePanel>
    );
}
