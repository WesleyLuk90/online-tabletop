type Process<K> = () => Promise<K>;

export class Lock<T> {
    private locks: Map<string, Process<void>[]> = new Map();

    constructor(readonly key: (t: T) => string) {}

    runExclusive<K>(t: T, callable: Process<K>): Promise<K> {
        const key = this.key(t);
        const empty = !this.locks.has(key);
        if (empty) {
            this.locks.set(key, []);
        }
        const promise = new Promise<K>((resolve, reject) => {
            this.locks.get(key)!!.push(() => callable().then(resolve, reject));
        });

        if (empty) {
            this.processNext(key);
        }
        return promise;
    }

    private async processNext(key: string) {
        const list = this.locks.get(key);
        if (list == null) {
            return;
        }
        const next = list.shift();
        if (next == null) {
            this.locks.delete(key);
            return;
        }
        next().then(
            () => this.processNext(key),
            () => this.processNext(key)
        );
    }
}
