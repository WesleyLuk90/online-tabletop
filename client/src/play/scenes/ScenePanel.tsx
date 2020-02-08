import {
    faLocationArrow,
    faPencilAlt,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import React, { useState } from "react";
import { Button } from "../../common/controls/Button";
import { IconButton } from "../../common/controls/IconButton";
import { ItemList } from "../../common/controls/ItemList";
import { SidePanel } from "../../common/layout/SidePanel";
import { plural } from "../../util/Plural";
import { SceneService } from "../SceneService";
import { SceneModal } from "./SceneModal";
import "./ScenePanel.css";

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
            <ItemList
                data={scenes}
                left={s => s.name}
                id={s => s.sceneID}
                right={s => (
                    <div className="scene-panel__actions">
                        <IconButton
                            inactive={s.sceneID !== myScene}
                            icon={faLocationArrow}
                            onClick={() => onChangeScene(s.sceneID)}
                            title="Visible Scene"
                        />
                        <IconButton
                            inactive={s.sceneID !== defaultScene}
                            icon={faUsers}
                            onClick={() => onChangeDefaultScene(s.sceneID)}
                            title="Players Scene"
                        />
                        <IconButton
                            icon={faPencilAlt}
                            onClick={() => {
                                setEdit(s);
                                setIsNew(false);
                            }}
                            title="Edit Scene"
                        />
                    </div>
                )}
            />
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
