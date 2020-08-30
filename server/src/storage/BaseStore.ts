import { ok } from "assert";
import { checkNotNull } from "../util/Nullable";
import { BaseModel } from "./BaseModel";
import { BaseSchema, Field } from "./BaseSchema";
import { Database, formatQuery } from "./Database";
import { Query, Where } from "./Query";

export class Row {
    static of(values: [Field<{}>, any][]) {
        return new Row(new Map(values));
    }

    constructor(readonly values: Map<Field<any>, any> = new Map()) {}

    set<T>(field: Field<T>, value: T) {
        if (value == null) {
            this.values.delete(field);
        } else {
            this.values.set(field, value);
        }
    }

    getOptional<T>(field: Field<T>): T | null {
        return this.values.get(field) ?? null;
    }

    get<T>(field: Field<T>): T {
        return checkNotNull(
            this.values.get(field),
            `Missing value for field ${field}`
        );
    }
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
        return new Results(results.rows.map((row) => this.fromDbRow(row)));
    }

    private fromDbRow(row: any): T {
        const modelRow = new Row();
        this.schema.fields
            .filter((field) => row[field.name] != null)
            .forEach((field) =>
                modelRow.set(field, field.type.fromDB(row[field.name]))
            );
        return this.factory(modelRow);
    }

    async findById(id: string): Promise<T | null> {
        return this.find(
            new Query({
                from: this.schema,
                limit: 1,
                where: Where.equals(
                    checkNotNull(
                        this.schema.primaryKey,
                        "Requires a primary key"
                    ),
                    id
                ),
            })
        ).then((r) => r.results[0] ?? null);
    }

    async create(model: T): Promise<T> {
        const client = await this.db.getClient();
        const fields: Field<{}>[] = [];
        const values: any[] = [];
        model.row.values.forEach((value, field) => {
            this.schema.validateField(field);
            fields.push(field);
            values.push(field.type.toDB(value));
        });
        let index = 1;
        const keyStatement = fields
            .map((field) => formatQuery("%I", field.name))
            .join(",");
        const valuesStatement = values.map(() => `$${index++}`).join(",");
        const results = await client.query({
            text: formatQuery(
                `INSERT INTO %I(${keyStatement}) VALUES(${valuesStatement}) RETURNING *`,
                this.schema.tableName
            ),
            values: values,
        });
        ok(
            results.rowCount == 1,
            `Expected 1 row back but got ${results.rowCount}`
        );
        return this.fromDbRow(results.rows[0]);
    }
}
