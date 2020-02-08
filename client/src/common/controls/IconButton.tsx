import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { BemBuilder } from "../../util/BemBuilder";
import { Icon } from "./Icon";
import "./IconButton.css";

const BEM = new BemBuilder("icon-button");

export function IconButton({
    inactive,
    onClick,
    icon,
    title
}: {
    inactive?: boolean;
    onClick: () => void;
    icon: IconProp;
    title?: string;
}) {
    return (
        <div
            className={BEM.block("active", !inactive)}
            onClick={e => {
                e.preventDefault();
                onClick();
            }}
            title={title}
        >
            <Icon icon={icon} />
        </div>
    );
}
