import React from "react";
import { assertExhaustive } from "../util/Exaustive";
import { CenterEllipseTool, EllipseTool } from "./tools/EllipseTool";
import { CenterRectangleTool, RectangleTool } from "./tools/RectTool";
import { SelectTool } from "./tools/SelectTool";
import { ToolProps } from "./tools/Tool";
import { ToolType } from "./tools/ToolType";

export function ToolLayer(
    props: {
        tool: ToolType;
    } & ToolProps
) {
    switch (props.tool) {
        case ToolType.select:
            return <SelectTool {...props} />;
        case ToolType.rectangle:
            return <RectangleTool {...props} />;
        case ToolType.centerRectangle:
            return <CenterRectangleTool {...props} />;
        case ToolType.ellipse:
            return <EllipseTool {...props} />;
        case ToolType.centerEllipse:
            return <CenterEllipseTool {...props} />;
        default:
            return assertExhaustive(props.tool);
    }
}
