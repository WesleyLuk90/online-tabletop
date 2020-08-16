import { BaseModel } from "./BaseModel";
import { BaseSchema, Field } from "./BaseSchema";
import { Database, formatQuery } from "./Database";
import { Query } from "./Query";

export class Row {
    static of(values: [Field<{}>, any][]) {
        return new Row(new Map(values));
    }

    constructor(readonly values: Map<Field<{}>, any> = new Map()) {}
}

export class Results<T extends BaseModel> {
    constructor(readonly results: T[]) {}
}

export abstract class BaseStore<T extends BaseModel> {
    constructor(
        readonly db: Database,
        readonly schema: BaseSchema,
        readonly factory: (row: Row) => T
    ) {}

    async find(query: Query): Promise<Results<T>> {
        const client = await this.db.getClient();
        const results = await client.query(query.toPostgres());
        return new Results(
            results.rows.map((row) => {
                const map = new Map();
                this.schema.fields.forEach((field) =>
                    map.set(field, row[field.name] ?? null)
                );
                return this.factory(new Row(map));
            })
        );
    }

    async create(model: T) {
        const client = await this.db.getClient();
        const fields: Field<{}>[] = [];
        const values: any[] = [];
        model.row.values.forEach((value, key) => {
            this.schema.validateField(key);
            fields.push(key);
            values.push(value);
        });
        let index = 1;
        const keyStatement = fields
            .map((field) => formatQuery("%I", field.name))
            .join(",");
        const valuesStatement = values.map(() => `$${index++}`).join(",");
        await client.query({
            text: formatQuery(
                `INSERT INTO %I(${keyStatement}) VALUES(${valuesStatement})`,
                this.schema.tableName
            ),
            values: values,
        });
    }
}
