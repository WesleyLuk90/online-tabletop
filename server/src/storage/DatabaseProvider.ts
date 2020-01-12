import { Db, MongoClient } from "mongodb";

class RetryingPromise<T> {
    promise: Promise<T> | null = null;

    constructor(private f: () => Promise<T>) {}

    get() {
        if (this.promise == null) {
            this.promise = this.f();
            this.promise.catch(() => (this.promise = null));
        }
        return this.promise;
    }

    getNullable() {
        return this.promise;
    }
}

export class DatabaseProvider {
    client: RetryingPromise<MongoClient> = new RetryingPromise(() =>
        MongoClient.connect(this.host, {
            useUnifiedTopology: true
        })
    );
    db: RetryingPromise<Db> = new RetryingPromise(() =>
        this.client.get().then(client => client.db(this.database))
    );

    constructor(readonly host: string, readonly database: string) {}

    async get() {
        return this.db.get();
    }

    async close() {
        const client = this.client.getNullable();
        if (client != null) {
            await (await client).close();
        }
    }
}
