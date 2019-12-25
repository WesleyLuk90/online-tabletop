import { Db, MongoClient } from "mongodb";

export class DatabaseProvider {
    clientPromise: Promise<MongoClient>;
    dbPromise: Promise<Db>;

    constructor(readonly host: string, readonly database: string) {
        this.clientPromise = MongoClient.connect(host);
        this.dbPromise = this.clientPromise.then(client => client.db(database));
    }

    async get() {
        return this.dbPromise;
    }

    async close() {
        const client = await this.clientPromise;
        await client.close();
    }
}
