import { Collection } from "mongodb";
import { NotFoundError } from "../Errors";
import { DatabaseProvider } from "./DatabaseProvider";

interface Document {
    _id: string;
}

interface Filter<T> {
    key: T;
    value: string;
}

interface Migration {
    (old: any): void;
}

export class MongoStorage<T, K = keyof T> {
    constructor(
        private dbProvider: DatabaseProvider,
        private collectionName: string,
        private parse: (data: Document) => T,
        readonly id: (t: T) => string,
        private migrations: Migration[] = []
    ) {}

    private migrateAndParse(data: any) {
        this.migrations.forEach(migration => migration(data));
        return this.parse(data);
    }

    async collection(): Promise<Collection<Document>> {
        const db = await this.dbProvider.get();
        return db.collection(this.collectionName);
    }

    async get(id: string): Promise<T | null> {
        const col = await this.collection();
        const data = await col.findOne({ _id: id });
        if (data == null) {
            return data;
        }
        return this.migrateAndParse(data);
    }

    async create(data: T): Promise<void> {
        const id = this.id(data);
        const doc = { ...data, _id: id };
        const col = await this.collection();
        await col.insertOne(doc);
    }

    async list(...filters: Filter<K>[]): Promise<T[]> {
        const filter: any = {};
        filters.forEach(f => (filter[f.key] = f.value));
        const collection = await this.collection();
        const results = await collection.find(filter);
        const list = await results.toArray();
        return list.map(d => this.migrateAndParse(d));
    }

    async update(data: T): Promise<void> {
        const doc: T & Partial<Document> = { ...data };
        delete doc._id;
        const collection = await this.collection();
        const updateResult = await collection.updateOne(
            { _id: this.id(data) },
            { $set: doc }
        );
        NotFoundError.check(
            updateResult.matchedCount === 1,
            this.collectionName,
            this.id(data)
        );
    }

    async delete(id: string): Promise<void> {
        const collection = await this.collection();
        await collection.deleteOne({ _id: id });
    }
}
