import {
    faCircle,
    faDotCircle,
    faSquare
} from "@fortawesome/free-regular-svg-icons";
import {
    faMousePointer,
    faVectorSquare
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Toolbar } from "../common/Toolbar";
import { ToolType } from "./tools/ToolType";

export function TokenToolbar({
    tool,
    setTool
}: {
    tool: ToolType;
    setTool: (tool: ToolType) => void;
}) {
    return (
        <Toolbar
            selected={tool}
            tools={[
                {
                    id: ToolType.select,
                    icon: faMousePointer,
                    onSelect: () => setTool(ToolType.select),
                    title: "Select"
                },
                {
                    id: ToolType.rectangle,
                    icon: faVectorSquare,
                    onSelect: () => setTool(ToolType.rectangle),
                    title: "Rectangle"
                },
                {
                    id: ToolType.centerRectangle,
                    icon: faSquare,
                    onSelect: () => setTool(ToolType.centerRectangle),
                    title: "Center Rectangle"
                },
                {
                    id: ToolType.ellipse,
                    icon: faCircle,
                    onSelect: () => setTool(ToolType.ellipse),
                    title: "Circle"
                },
                {
                    id: ToolType.centerEllipse,
                    icon: faDotCircle,
                    onSelect: () => setTool(ToolType.centerEllipse),
                    title: "Center Circle"
                }
            ]}
        />
    );
}
