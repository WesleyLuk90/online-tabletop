import React, { useState } from "react";
import { Color, Colors } from "../Colors";
import { Ellipse } from "../Ellipse";
import { useMapEvents } from "../input/MapEvents";
import { EllipseToken } from "../tokens/EllipseToken";
import { ToolCreatableToken, ToolProps } from "./Tool";

function ellipseToken(ellipse: Ellipse): ToolCreatableToken {
    return {
        x: ellipse.left(),
        y: ellipse.top(),
        width: ellipse.width(),
        height: ellipse.height(),
        data: {
            type: "ellipse",
            strokeColor: Colors[0],
            strokeWidth: 3,
            fillColor: new Color(10, 10, 10, 0.1)
        }
    };
}

export function EllipseTool({ callbacks: { createToken } }: ToolProps) {
    const [ellipse, setEllipse] = useState<Ellipse | null>();
    useMapEvents({
        onDrag: (s, c) => setEllipse(Ellipse.fromCorners(s, c)),
        onDragEnd: (s, e) => {
            setEllipse(null);
            createToken(ellipseToken(Ellipse.fromCorners(s, e)));
        }
    });

    if (!ellipse) {
        return null;
    }

    return (
        <EllipseToken
            ellipse={ellipse}
            strokeColor={Colors[0]}
            strokeWidth={3}
            fillColor={new Color(10, 10, 10, 0.1)}
        />
    );
}

export function CenterEllipseTool({ callbacks: { createToken } }: ToolProps) {
    const [ellipse, setEllipse] = useState<Ellipse | null>();
    useMapEvents({
        onDrag: (s, c) => setEllipse(new Ellipse(s, c.subtract(s).abs())),
        onDragEnd: (s, e) => {
            setEllipse(null);
            createToken(ellipseToken(new Ellipse(s, e.subtract(s).abs())));
        }
    });

    if (!ellipse) {
        return null;
    }

    return (
        <EllipseToken
            ellipse={ellipse}
            strokeColor={Colors[0]}
            strokeWidth={3}
            fillColor={new Color(10, 10, 10, 0.1)}
        />
    );
}
