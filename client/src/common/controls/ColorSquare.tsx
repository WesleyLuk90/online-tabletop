import { ColorData } from "engine/models/Color";
import React from "react";
import { BemBuilder } from "../../util/BemBuilder";
import { ColorService } from "../ColorService";
import "./ColorSquare.css";

const BEM = new BemBuilder("color-square");

export function ColorSquare({
    color,
    highlight,
}: {
    color: ColorData;
    highlight?: boolean;
}) {
    return (
        <div
            className={BEM.block("highlight", highlight === true)}
            style={{ backgroundColor: ColorService.toRGBA(color) }}
        ></div>
    );
}
