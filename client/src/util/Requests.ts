export function notFoundToNull(reason: any): null {
    if (reason && reason.request && reason.request.status === 404) {
        return null;
    }
    throw reason;
}
