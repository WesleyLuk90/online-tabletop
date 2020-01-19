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
import { Tool } from "./Tools";

export function TokenToolbar({
    tool,
    setTool
}: {
    tool: Tool;
    setTool: (tool: Tool) => void;
}) {
    return (
        <Toolbar
            selected={tool}
            tools={[
                {
                    id: Tool.select,
                    icon: faMousePointer,
                    onSelect: () => setTool(Tool.select),
                    title: "Select"
                },
                {
                    id: Tool.rectangle,
                    icon: faVectorSquare,
                    onSelect: () => setTool(Tool.rectangle),
                    title: "Rectangle"
                },
                {
                    id: Tool.centerRectangle,
                    icon: faSquare,
                    onSelect: () => setTool(Tool.centerRectangle),
                    title: "Center Rectangle"
                },
                {
                    id: Tool.circle,
                    icon: faCircle,
                    onSelect: () => setTool(Tool.circle),
                    title: "Circle"
                },
                {
                    id: Tool.centerCircle,
                    icon: faDotCircle,
                    onSelect: () => setTool(Tool.centerCircle),
                    title: "Center Circle"
                }
            ]}
        />
    );
}
