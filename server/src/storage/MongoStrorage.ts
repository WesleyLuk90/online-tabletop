import { Collection, Db } from "mongodb";

interface Document {
    _id: string;
}

interface Filter<T> {
    key: keyof T;
    value: string;
}

export class MongoStorage<T> {
    constructor(
        private database: Db,
        private collectionName: string,
        private parse: (data: Document) => T,
        private id: (t: T) => string
    ) {}

    async collection(): Promise<Collection<Document>> {
        return this.database.collection(this.collectionName);
    }

    async get(id: string): Promise<T | null> {
        const col = await this.collection();
        const data = await col.findOne({ _id: id });
        if (data == null) {
            return data;
        }
        return this.parse(data);
    }

    async create(data: T): Promise<void> {
        const id = this.id(data);
        const doc = { ...data, _id: id };
        const col = await this.collection();
        await col.insertOne(doc);
    }

    async list(...filters: Filter<T>[]): Promise<T[]> {
        const filter: { [k in keyof T]?: string } = {};
        filters.forEach(f => (filter[f.key] = f.value));
        const collection = await this.collection();
        const results = await collection.find(filter);
        const list = await results.toArray();
        return list.map(this.parse);
    }

    async update(data: T): Promise<void> {
        const doc: T & Partial<Document> = { ...data };
        delete doc._id;
        const collection = await this.collection();
        await collection.update({ _id: this.id(data) }, doc);
    }

    async delete(id: string): Promise<void> {
        const collection = await this.collection();
        await collection.deleteOne({ _id: id });
    }
}
