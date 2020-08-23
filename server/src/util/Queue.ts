export class Queue<T> {
    private current: Promise<void> | null = null;
    private queue: T[] = [];

    constructor(private process: (t: T) => Promise<void>) {}

    enqueue(t: T) {
        this.queue.push(t);
        this.processIfIdle();
    }

    private processIfIdle() {
        if (this.current == null) {
            this.current = this.processNext();
        }
    }

    private async processNext(): Promise<void> {
        const next = this.queue.shift();
        if (next == null) {
            this.current = null;
            return;
        }
        try {
            await this.process(next);
        } catch (e) {
            console.error(e);
        }
        return this.processNext();
    }

    complete(): Promise<void> {
        return this.current || Promise.resolve();
    }
}
