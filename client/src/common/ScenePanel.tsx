import {
    faEye,
    faLocationArrow,
    faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import React, { useState } from "react";
import { SceneService } from "../play/SceneService";
import { plural } from "../util/Plural";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { SceneModal } from "./SceneModal";
import "./ScenePanel.css";
import { SidePanel } from "./SidePanel";

export function ScenePanel({
    campaign,
    myScene,
    defaultScene,
    scenes,
    onChangeScene,
    onChangeDefaultScene,
    onUpdateScene,
    onCreateScene,
    onDeleteScene
}: {
    campaign: Campaign;
    myScene: string;
    defaultScene: string;
    scenes: Scene[];
    onChangeScene: (sceneID: string) => void;
    onChangeDefaultScene: (sceneID: string) => void;
    onUpdateScene: (sceneID: string, update: Partial<Scene>) => void;
    onCreateScene: (scene: Scene) => void;
    onDeleteScene: (scene: Scene) => void;
}) {
    const [edit, setEdit] = useState<Scene | null>(null);
    const [isNew, setIsNew] = useState(false);

    return (
        <SidePanel header="Scenes">
            <SceneModal
                scene={edit}
                onChange={setEdit}
                onCancel={() => setEdit(null)}
                onDelete={s => {
                    onDeleteScene(s);
                    setEdit(null);
                }}
                isNew={isNew}
                onSave={async toSave => {
                    if (isNew) {
                        onCreateScene(toSave);
                    } else {
                        onUpdateScene(toSave.sceneID, toSave);
                    }
                    setEdit(null);
                }}
            />
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
                            onClick={() => {
                                setEdit(s);
                                setIsNew(false);
                            }}
                            title="Editing Scene"
                        />
                    </div>
                </div>
            ))}
            <div className="scene-panel__footer">
                <p>
                    {scenes.length} {plural(scenes.length, "scene")}
                </p>
                <Button
                    onClick={() => {
                        setEdit(SceneService.createDefaultScene(campaign.id));
                        setIsNew(true);
                    }}
                >
                    New Scene
                </Button>
            </div>
        </SidePanel>
    );
}
