export function checkState(state: boolean, error?: string) {
    if (!state) {
        throw new Error(error || "Invalid state");
    }
}
