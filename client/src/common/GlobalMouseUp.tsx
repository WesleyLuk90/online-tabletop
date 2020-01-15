import { useEffect, useRef } from "react";

export function GlobalMouseUp({ onMouseUp }: { onMouseUp: () => void }) {
    const callback = useRef(onMouseUp);
    useEffect(() => {
        callback.current = onMouseUp;
    }, [onMouseUp]);

    useEffect(() => {
        function mouseUp() {
            callback.current();
        }
        document.addEventListener("mouseup", mouseUp);
        return () => document.removeEventListener("mouseup", mouseUp);
    });

    return null;
}
