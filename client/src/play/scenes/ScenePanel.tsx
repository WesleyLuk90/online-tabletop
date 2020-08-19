import {
    faLocationArrow,
    faPencilAlt,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Campaign } from "engine/models/Campaign";
import { Scene } from "engine/models/Scene";
import React, { useState } from "react";
import { Button } from "../../common/controls/Button";
import { IconButton } from "../../common/controls/IconButton";
import { ItemList } from "../../common/controls/ItemList";
import { SidePanel } from "../../common/layout/SidePanel";
import { plural } from "../../util/Plural";
import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { RequestChangeDefaultScene } from "../gamestate/events/RequestChangeDefaultScene";
import { RequestChangeMyScene } from "../gamestate/events/RequestChangeMyScene";
import { RequestCreateScene } from "../gamestate/events/RequestCreateScene";
import { RequestDeleteScene } from "../gamestate/events/RequestDeleteScene";
import { RequestUpdateScene } from "../gamestate/events/RequestUpdateScene";
import { SceneService } from "../SceneService";
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
    dispatch: DispatchGameEvent;
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
                    dispatch(new RequestDeleteScene(s));
                    setEdit(null);
                }}
                isNew={isNew}
                onSave={async (toSave) => {
                    if (isNew) {
                        dispatch(new RequestCreateScene(toSave));
                    } else {
                        dispatch(new RequestUpdateScene(toSave));
                    }
                    setEdit(null);
                }}
            />
            <ItemList
                data={scenes}
                left={(s) => s.name}
                id={(s) => s.sceneID}
                right={(s) => (
                    <div className="scene-panel__actions">
                        <IconButton
                            inactive={s.sceneID !== myScene}
                            icon={faLocationArrow}
                            onClick={() =>
                                dispatch(new RequestChangeMyScene(s.sceneID))
                            }
                            title="Visible Scene"
                        />
                        <IconButton
                            inactive={s.sceneID !== defaultScene}
                            icon={faUsers}
                            onClick={() =>
                                dispatch(
                                    new RequestChangeDefaultScene(s.sceneID)
                                )
                            }
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
