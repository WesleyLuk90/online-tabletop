import React from "react";
import { Dropdown } from "../common/Dropdown";

export function SceneSelector() {
    return (
        <div>
            <Dropdown
                value="a"
                options={["a", "b", "c", "d"]}
                id={o => o}
                format={o => o}
            />
        </div>
    );
}
