import React, { ReactNode, useRef } from "react";
import { interpolate, percent } from "../util/Math";
import { checkNotNull } from "../util/Nullable";
import { useDebounced } from "./Debouncer";
import { Rectangle } from "./Rectangle";
import { Vector } from "./Vector";

enum Button {
    Primary = 0,
    Secondary = 2
}

const MIN_DRAG_DISTANCE = 5;

class MouseState {
    constructor(
        readonly screenStart: Vector,
        readonly start: Vector,
        readonly isDrag: boolean
    ) {}

    withIsDrag(isDrag: boolean) {
        return new MouseState(this.screenStart, this.start, isDrag);
    }
}

function fromEvent(e: React.MouseEvent) {
    return new Vector(e.clientX, e.clientY);
}

export function Svg({
    children,
    viewport,
    size,
    onClick,
    onRightClick,
    onDrag,
    onDragEnd,
    onPan,
    onPanEnd,
    onZoom
}: {
    children: ReactNode;
    viewport: Rectangle;
    size: Vector;
    onClick: (pos: Vector) => void;
    onRightClick: (pos: Vector) => void;
    onDrag: (start: Vector, current: Vector) => void;
    onDragEnd: (start: Vector, end: Vector) => void;
    onPan: (start: Vector, current: Vector) => void;
    onPanEnd: (start: Vector, current: Vector) => void;
    onZoom: (ticks: number) => void;
}) {
    const primaryMouseState = useRef<null | MouseState>(null);
    const secondaryMouseState = useRef<null | MouseState>(null);
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

    function startMouseState(
        ref: React.MutableRefObject<null | MouseState>,
        button: Button,
        event: React.MouseEvent<SVGSVGElement>
    ) {
        if (ref.current != null) {
            return;
        }
        if (event.button !== button) {
            return;
        }
        ref.current = new MouseState(
            fromEvent(event),
            screenToWorld(fromEvent(event)),
            false
        );
    }

    function updateMouseState(
        ref: React.MutableRefObject<null | MouseState>,
        event: React.MouseEvent<SVGSVGElement>,
        dragHandler: (mouseState: MouseState, screenLocation: Vector) => void
    ) {
        if (ref.current == null) {
            return;
        }
        if (!ref.current.isDrag) {
            if (
                ref.current.screenStart.subtract(fromEvent(event)).length() >
                MIN_DRAG_DISTANCE
            ) {
                ref.current = ref.current.withIsDrag(true);
            }
        } else {
            dragHandler(ref.current, fromEvent(event));
        }
    }

    function updateMouseEnd(
        ref: React.MutableRefObject<null | MouseState>,
        event: React.MouseEvent<SVGSVGElement>,
        clickHandler: (location: Vector) => void,
        dragEndHandler: (mouseState: MouseState, screenLocation: Vector) => void
    ) {
        if (ref.current == null) {
            return;
        }
        if (!ref.current.isDrag) {
            clickHandler(ref.current.start);
        } else {
            dragEndHandler(ref.current, fromEvent(event));
        }
        ref.current = null;
    }

    const panDebounced = useDebounced(onPan);
    const panEndDebounced = useDebounced(onPanEnd);
    const dragDebounced = useDebounced(onDrag);
    const dragEndDebounced = useDebounced(onDragEnd);

    function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        startMouseState(primaryMouseState, Button.Primary, e);
        startMouseState(secondaryMouseState, Button.Secondary, e);
    }
    function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        updateMouseState(primaryMouseState, e, (s, loc) =>
            dragDebounced(s.start, screenToWorld(loc))
        );
        updateMouseState(secondaryMouseState, e, (s, loc) =>
            panDebounced(s.screenStart, loc)
        );
    }
    function onMouseUp(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        updateMouseEnd(
            primaryMouseState,
            e,
            s => onClick(s),
            (s, loc) => dragEndDebounced(s.start, screenToWorld(loc))
        );
        updateMouseEnd(
            secondaryMouseState,
            e,
            s => onRightClick(s),
            (s, loc) => panEndDebounced(s.screenStart, loc)
        );
    }

    function onWheel(e: React.WheelEvent<SVGSVGElement>) {
        onZoom(e.deltaY / 100);
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
            onWheel={onWheel}
        >
            {children}
        </svg>
    );
}
