export function checkState(state: boolean) {
    if (!state) {
        throw new Error("Invalid state");
    }
}
