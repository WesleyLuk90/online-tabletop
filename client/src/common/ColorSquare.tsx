import { Color } from "protocol/src/Color";
import React from "react";
import { ColorService } from "./ColorService";
import "./ColorSquare.css";

export function ColorSquare({ color }: { color: Color }) {
    return (
        <div
            className="color-square"
            style={{ backgroundColor: ColorService.toRGBA(color) }}
        ></div>
    );
}
