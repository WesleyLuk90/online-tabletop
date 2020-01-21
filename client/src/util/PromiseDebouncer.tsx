export class PromiseDebouncer<T> {
    private lastPromise: Promise<T> | null = null;

    debounce(promise: Promise<T>): Promise<T> {
        this.lastPromise = promise;
        return new Promise((resolve, reject) => {
            promise.then(
                result => {
                    if (this.lastPromise === promise) {
                        resolve(result);
                    }
                },
                error => {
                    if (this.lastPromise === promise) {
                        reject(error);
                    }
                }
            );
        });
    }
}
