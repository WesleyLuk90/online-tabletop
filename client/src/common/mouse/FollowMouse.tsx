import { Vector } from "engine/math/Vector";
import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

const FollowContext = React.createContext<HTMLDivElement | null>(null);

export function FollowContainer({ children }: { children: ReactNode }) {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const setRef = useCallback(setElement, []);
    return (
        <FollowContext.Provider value={element}>
            <div ref={setRef}></div>
            {children}
        </FollowContext.Provider>
    );
}

export function FollowMouse({
    children,
    onMouseMove,
}: {
    children: ReactNode;
    onMouseMove: (pos: Vector) => void;
}) {
    const followContext = useContext(FollowContext);
    const [position, setPosition] = useState(new Vector(0, 0));

    const safeCallback = useRef(onMouseMove);

    useEffect(() => {
        safeCallback.current = onMouseMove;
    }, [onMouseMove]);

    useEffect(() => {
        const callback = (e: MouseEvent) => {
            setPosition(new Vector(e.clientX, e.clientY));
            safeCallback.current(new Vector(e.clientX, e.clientY));
        };
        document.addEventListener("mousemove", callback);
        return () => document.removeEventListener("mousemove", callback);
    }, []);

    if (followContext != null) {
        return createPortal(
            <div
                style={{
                    position: "fixed",
                    left: position.x,
                    top: position.y,
                    zIndex: 10000,
                }}
            >
                {children}
            </div>,
            followContext
        );
    } else {
        console.warn("No follow container found");
        return null;
    }
}
