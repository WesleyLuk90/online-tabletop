import { Collection } from "mongodb";
import { NotFoundError } from "../Errors";
import { checkNotNull } from "../util/Nullable";
import { DatabaseProvider } from "./DatabaseProvider";

export interface Document {
    _id: string;
}

interface Filter {
    key: Field;
    value: string;
}

interface Migration {
    (old: any): void;
}

export class Field {
    constructor(readonly name: string, readonly index: boolean = true) {}

    isEqualTo(value: string): Filter {
        return { key: this, value: value };
    }

    contains(value: string): Filter {
        return { key: this, value: value };
    }
}

export class CompoundIndex {
    constructor(readonly fields: Field[]) {}
}

export abstract class MongoStorage<T> {
    private knownIndexes: string[][] | null = null;

    constructor(private dbProvider: DatabaseProvider) {}

    abstract collectionName(): string;
    abstract parse(data: Document): T;
    abstract id(t: T): string;

    fields(): Field[] {
        return [];
    }

    migrations(): Migration[] {
        return [];
    }

    compoundsIndexes(): CompoundIndex[] {
        return [];
    }

    async initialize() {
        const db = await this.dbProvider.get();
        await db.createCollection(this.collectionName());
        const indexes = this.fields()
            .filter(f => f.index)
            .map(f => ({
                key: {
                    [f.name]: 1
                }
            }));
        this.compoundsIndexes()
            .map(index => {
                const object: any = {};
                index.fields.forEach(f => (object[f.name] = 1));
                return object;
            })
            .map(key => ({ key }))
            .forEach(index => indexes.push(index));
        if (indexes.length > 0) {
            const collection = await this.collection();
            await collection.createIndexes(indexes);
        }
    }

    private migrateAndParse(data: any) {
        this.migrations().forEach(migration => migration(data));
        return this.parse(data);
    }

    async collection(): Promise<Collection<Document>> {
        const db = await this.dbProvider.get();
        const collection = db.collection(this.collectionName());
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

    async list(...filters: Filter[]): Promise<T[]> {
        const filter: any = {};
        await this.checkIndexes(filters);
        filters.forEach(f => (filter[f.key.name] = f.value));
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
            this.collectionName(),
            this.id(data)
        );
    }

    async delete(id: string): Promise<void> {
        const collection = await this.collection();
        await collection.deleteOne({ _id: id });
    }

    private async checkIndexes(filters: Filter[]) {
        if (this.knownIndexes === null) {
            const collection = await this.collection();
            const indexes = await collection.indexes();
            this.knownIndexes = indexes.map((i: any) => Object.keys(i.key));
        }
        const known = checkNotNull(this.knownIndexes);
        if (!filtersMatchIndexes(filters, known)) {
            throw new Error(
                `Missing index on ${
                    this.collectionName
                } cannot query [${filters
                    .map(f => f.key.name)
                    .join(", ")}]. Known indexes ${JSON.stringify(known)}`
            );
        }
    }
}

function filtersMatchIndexes<T>(filters: Filter[], indexes: string[][]) {
    const fields = new Set(filters.map(f => f.key.name));
    return indexes.some(index => setsEqual(fields, new Set(index)));
}

function setsEqual<T>(a: Set<T>, b: Set<T>) {
    return a.size === b.size && Array.from(a).every(e => b.has(e));
}
