import React, { useState } from "react";
import { Color, Colors } from "../Colors";
import { Ellipse } from "../Ellipse";
import { useMapEvents } from "../input/MapEvents";
import { EllipseToken } from "../tokens/EllipseToken";
import { CreatableToken } from "../tokens/TokenService";
import { ToolProps } from "./Tool";

function ellipseToken(ellipse: Ellipse): CreatableToken {
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

export function EllipseTool({ services, gameState }: ToolProps) {
    const [ellipse, setEllipse] = useState<Ellipse | null>();
    useMapEvents({
        onDrag: (s, c) => setEllipse(Ellipse.fromCorners(s, c)),
        onDragEnd: (s, e) => {
            setEllipse(null);
            services
                .tokenService()
                .create(gameState, ellipseToken(Ellipse.fromCorners(s, e)));
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

export function CenterEllipseTool({ gameState, services }: ToolProps) {
    const [ellipse, setEllipse] = useState<Ellipse | null>();
    useMapEvents({
        onDrag: (s, c) => setEllipse(new Ellipse(s, c.subtract(s).abs())),
        onDragEnd: (s, e) => {
            setEllipse(null);
            services
                .tokenService()
                .create(
                    gameState,
                    ellipseToken(new Ellipse(s, e.subtract(s).abs()))
                );
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
