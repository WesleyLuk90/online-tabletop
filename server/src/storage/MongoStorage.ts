import { Collection } from "mongodb";
import { NotFoundError } from "../Errors";
import { checkNotNull } from "../util/Nullable";
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

export class Field<K> {
    constructor(readonly name: K) {}

    getName(): string {
        return this.name as any;
    }
}

export class MongoStorage<T, K> {
    knownIndexes: string[][] | null = null;
    checkedIndexes = false;

    constructor(
        private dbProvider: DatabaseProvider,
        private collectionName: string,
        private parse: (data: Document) => T,
        readonly id: (t: T) => string,
        private fields: Field<K>[],
        private migrations: Migration[] = []
    ) {}

    async createCollection() {
        const db = await this.dbProvider.get();
        await db.createCollection(this.collectionName);
    }

    private migrateAndParse(data: any) {
        this.migrations.forEach(migration => migration(data));
        return this.parse(data);
    }

    async collection(): Promise<Collection<Document>> {
        const db = await this.dbProvider.get();
        const collection = db.collection(this.collectionName);
        if (!this.checkedIndexes && this.fields.length > 0) {
            const indexes = this.fields.map(f => ({
                key: {
                    [f.getName()]: 1
                }
            }));
            await collection.createIndexes(indexes);
            this.checkedIndexes = true;
        }
        return collection;
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
        await this.ensureIndexes(filters);
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

    private async ensureIndexes(filters: Filter<K>[]) {
        if (this.knownIndexes === null) {
            const collection = await this.collection();
            const indexes = await collection.indexes();
            this.knownIndexes = indexes.map((i: any) => Object.keys(i.key));
        }
        const known = checkNotNull(this.knownIndexes);
        filters.forEach(filter => {
            if (
                !known.some(
                    index =>
                        index.length === 1 && (index[0] as any) !== filter.key
                )
            ) {
                throw new Error(
                    `Missing index ${this.collectionName}.${filter.key}`
                );
            }
        });
    }
}
