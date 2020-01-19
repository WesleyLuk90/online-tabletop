import { useRef } from "react";

export class Debouncer {
    animationFrame = 0;

    debounce(action: () => void) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(action);
    }
}

export function useDebounced<A extends any[]>(
    f: (...args: A) => void
): (...args: A) => void {
    const debouncer = useRef(new Debouncer());

    return (...args) => debouncer.current.debounce(() => f(...args));
}
