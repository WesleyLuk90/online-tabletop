import {
    faLocationArrow,
    faPencilAlt,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Campaign } from "engine/engine/models/Campaign";
import { Scene } from "engine/engine/models/Scene";
import React, { useState } from "react";
import { Button } from "../../common/controls/Button";
import { IconButton } from "../../common/controls/IconButton";
import { ItemList } from "../../common/controls/ItemList";
import { SidePanel } from "../../common/layout/SidePanel";
import { plural } from "../../util/Plural";
import { SceneModal } from "./SceneModal";
import "./ScenePanel.css";

export function ScenePanel({
    campaign,
    myScene,
    defaultScene,
    scenes,
    dispatch,
}: {
    campaign: Campaign;
    myScene: string;
    defaultScene: string;
    scenes: Scene[];
    dispatch: (a: any) => void;
}) {
    const [edit, setEdit] = useState<Scene | null>(null);
    const [isNew, setIsNew] = useState(false);

    return (
        <SidePanel header="Scenes">
            <SceneModal
                scene={edit}
                onChange={setEdit}
                onCancel={() => setEdit(null)}
                onDelete={(s) => {
                    setEdit(null);
                }}
                isNew={isNew}
                onSave={async (toSave) => {
                    if (isNew) {
                    } else {
                    }
                    setEdit(null);
                }}
            />
            <ItemList
                data={scenes}
                left={(s) => s.name}
                id={(s) => s.id}
                right={(s) => (
                    <div className="scene-panel__actions">
                        <IconButton
                            inactive={s.id !== myScene}
                            icon={faLocationArrow}
                            title="Visible Scene"
                            onClick={() => {}}
                        />
                        <IconButton
                            inactive={s.id !== defaultScene}
                            icon={faUsers}
                            title="Players Scene"
                            onClick={() => {}}
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
                        // setEdit(SceneService.createDefaultScene(campaign.id));
                        setIsNew(true);
                    }}
                >
                    New Scene
                </Button>
            </div>
        </SidePanel>
    );
}
