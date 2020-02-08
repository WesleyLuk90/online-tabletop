import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { BemBuilder } from "../../util/BemBuilder";
import { Icon } from "../controls/Icon";
import "./Toolbar.css";

interface Tool {
    id: string;
    icon: IconProp;
    onSelect: () => void;
    title: string;
}

const BEM = new BemBuilder("toolbar");

export function Toolbar({
    tools,
    selected
}: {
    tools: Tool[];
    selected: string;
}) {
    return (
        <div className={BEM.block()}>
            {tools.map((t, i) => (
                <div
                    className={BEM.element("tool", "active", selected === t.id)}
                    title={t.title}
                    key={i}
                    onClick={t.onSelect}
                >
                    <Icon icon={t.icon} />
                </div>
            ))}
        </div>
    );
}
