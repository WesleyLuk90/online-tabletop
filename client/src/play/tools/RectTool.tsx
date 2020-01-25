import React, { useState } from "react";
import { Color, Colors } from "../Colors";
import { useMapEvents } from "../input/MapEvents";
import { Rectangle } from "../Rectangle";
import { SvgRect } from "../svg/SvgRect";
import { ToolProps } from "./Tool";

// abstract class AbstractRectTool extends TokenCreationTool {
//     abstract getRect(dragStart: Vector, dragCurrent: Vector): Rectangle;

//     render(dragStart: Vector, dragCurrent: Vector) {
//         return (
//             <SvgRect
//                 rect={this.getRect(dragStart, dragCurrent)}
//                 strokeColor={Colors[0]}
//                 strokeWidth={3}
//                 fillColor={new Color(10, 10, 10, 0.1)}
//             />
//         );
//     }

//     create(dragStart: Vector, dragEnd: Vector): ToolCreatableToken {
//         const rect = this.getRect(dragStart, dragEnd);
//         return {
//             x: rect.left,
//             y: rect.top,
//             width: rect.width(),
//             height: rect.height(),
//             data: {
//                 type: "square",
//                 strokeColor: Colors[0],
//                 strokeWidth: 3,
//                 fillColor: new Color(10, 10, 10, 0.1)
//             }
//         };
//     }
// }

export function RectangleTool(props: ToolProps) {
    const [rect, setRect] = useState<Rectangle | null>();
    useMapEvents({
        onDrag: (s, c) => setRect(Rectangle.fromCorners(s, c))
    });

    if (!rect) {
        return null;
    }

    return (
        <SvgRect
            rect={rect}
            strokeColor={Colors[0]}
            strokeWidth={3}
            fillColor={new Color(10, 10, 10, 0.1)}
        />
    );
}

// export class CenterRectangleTool extends AbstractRectTool {
//     getRect(dragStart: Vector, dragCurrent: Vector) {
//         return Rectangle.fromCenterAndCorner(dragStart, dragCurrent);
//     }
// }
