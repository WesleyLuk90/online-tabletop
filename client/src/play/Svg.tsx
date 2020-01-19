import React, { ReactNode, useRef } from "react";
import { interpolate, percent } from "../util/Math";
import { checkNotNull } from "../util/Nullable";
import { Vector } from "./Vector";
import { Viewport } from "./Viewport";

enum Button {
    Primary = 0,
    Secondary = 1
}

const MIN_DRAG_DISTANCE = 5;

class MouseState {
    constructor(
        readonly screenStart: Vector,
        readonly start: Vector,
        readonly button: Button,
        readonly isDrag: boolean
    ) {}

    withIsDrag(isDrag: boolean) {
        return new MouseState(
            this.screenStart,
            this.start,
            this.button,
            isDrag
        );
    }
}

export function Svg({
    children,
    viewport,
    size,
    onClick,
    onDrag,
    onDragEnd
}: {
    children: ReactNode;
    viewport: Viewport;
    size: Vector;
    onClick: (pos: Vector) => void;
    onDrag: (start: Vector, current: Vector) => void;
    onDragEnd: (start: Vector, end: Vector) => void;
}) {
    const mouseState = useRef<null | MouseState>(null);
    const ref = useRef<SVGSVGElement>(null);

    function screenToWorld(screen: Vector) {
        const boundingBox = checkNotNull(ref.current).getBoundingClientRect();
        return new Vector(
            interpolate(
                viewport.left,
                viewport.right,
                percent(boundingBox.left, boundingBox.right, screen.x)
            ),
            interpolate(
                viewport.top,
                viewport.bottom,
                percent(boundingBox.top, boundingBox.bottom, screen.y)
            )
        );
    }

    function fromEvent(e: React.MouseEvent) {
        return new Vector(e.clientX, e.clientY);
    }

    function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        if (mouseState.current != null) {
            return;
        }
        const button = e.button;
        if (button !== Button.Primary && button !== Button.Secondary) {
            return;
        }
        mouseState.current = new MouseState(
            fromEvent(e),
            screenToWorld(fromEvent(e)),
            button,
            false
        );
    }
    function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
        const current = mouseState.current;
        if (current == null) {
            return;
        }
        if (current.button !== e.button) {
            return;
        }
        if (!current.isDrag) {
            if (
                current.screenStart.subtract(fromEvent(e)).length() >
                MIN_DRAG_DISTANCE
            ) {
                mouseState.current = current.withIsDrag(true);
            }
        } else {
            onDrag(current.start, screenToWorld(fromEvent(e)));
        }
    }
    function onMouseUp(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        if (mouseState.current == null) {
            return;
        }
        if (mouseState.current.button !== e.button) {
            return;
        }
        if (!mouseState.current.isDrag) {
            onClick(mouseState.current.start);
        } else {
            onDragEnd(mouseState.current.start, screenToWorld(fromEvent(e)));
        }
        mouseState.current = null;
    }

    return (
        <svg
            ref={ref}
            viewBox={`${viewport.left} ${
                viewport.top
            } ${viewport.width()} ${viewport.height()}`}
            width={size.x}
            height={size.y}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onContextMenu={e => e.preventDefault()}
        >
            {children}
        </svg>
    );
}
