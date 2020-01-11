export function lazy<T>(f: () => T): () => T {
    let value: T | null = null;
    let isProcessing = false;
    let isComputed = false;
    return (): T => {
        if (!isComputed) {
            if (isProcessing) {
                throw new Error("Circular dependency");
            }
            isProcessing = true;
            value = f();
            isProcessing = false;
            isComputed = true;
        }
        return value as any;
    };
}

export abstract class Module {}
