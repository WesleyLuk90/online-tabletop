import React, { ReactNode, useEffect, useRef } from "react";

export function ClickAway({
    onClickAway,
    children
}: {
    onClickAway: () => void;
    children: ReactNode;
}) {
    const div = useRef<HTMLDivElement>(null);
    const callback = useRef(onClickAway);
    useEffect(() => {
        callback.current = onClickAway;
    });
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as Element | null;
            for (let t = target; t != null; t = t.parentElement) {
                if (t === div.current) {
                    return;
                }
            }
            callback.current();
        }
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return <div ref={div}>{children}</div>;
}
