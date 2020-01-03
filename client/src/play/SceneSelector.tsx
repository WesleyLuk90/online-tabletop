import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import React from "react";
import { Dropdown } from "../common/Dropdown";
import "./SceneSelector.css";

export function SceneSelector({
    campaign,
    scenes
}: {
    campaign: Campaign;
    scenes: Scene[];
}) {
    return (
        <div className="scene-selector">
            <div>Scene</div>
            <div className="scene-selector__dropdown">
                <Dropdown
                    value={scenes.find(s => false)}
                    options={scenes}
                    id={s => (s && s.sceneID) || ""}
                    format={s => (s && s.name) || "No Scene"}
                    onChange={s => console.log(s)}
                />
            </div>
        </div>
    );
}
