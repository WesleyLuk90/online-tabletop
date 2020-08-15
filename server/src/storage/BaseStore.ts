import { BaseSchema, Field } from "./BaseSchema";
import { Database } from "./Database";
import { Query } from "./Query";

export class Record {
    static of(values: [Field<{}>, any][]) {
        return new Record(new Map(values));
    }

    constructor(readonly values: Map<Field<{}>, any>) {}
}

export class Results {
    constructor(readonly results: Record[]) {}
}

export abstract class BaseStore {
    constructor(readonly db: Database, readonly schema: BaseSchema) {}

    async find(query: Query): Promise<Results> {
        const client = await this.db.getClient();
        const results = await client.query(query.toPostgres());
        return new Results(
            results.rows.map((row) => {
                const map = new Map();
                this.schema.fields.forEach((field) =>
                    map.set(field, row[field.name] ?? null)
                );
                return new Record(map);
            })
        );
    }

    async create(record: Record) {
        const client = await this.db.getClient();
        const fields: Field<{}>[] = [];
        const values: any[] = [];
        record.values.forEach((value, key) => {
            this.schema.validateField(key);
            fields.push(key);
            values.push(value);
        });
        let index = 1;
        const keyStatement = fields.map((field) => field.name).join(",");
        const valuesStatement = values.map(() => `$${index++}`).join(",");
        await client.query({
            text: `INSERT INTO ${this.schema.tableName}(${keyStatement}) VALUES(${valuesStatement})`,
            values: values,
        });
    }
}
