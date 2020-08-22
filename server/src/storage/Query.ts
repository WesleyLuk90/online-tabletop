import { QueryConfig } from "pg";
import { BaseSchema, Field } from "./BaseSchema";
import { formatIdentifier } from "./Database";

type Value = number | string;

export class Where {
    static equals<T>(field: Field<T>, value: T): Where {
        return new Where(field, value);
    }
    constructor(readonly field: Field<any>, readonly value: any) {}

    toPostgres(value: (v: Value) => string) {
        return `WHERE ${formatIdentifier(this.field.name)} = ${value(
            this.value
        )}`;
    }
}

export class Query {
    constructor(
        readonly properties: {
            from: BaseSchema;
            limit?: number;
            where?: Where;
        }
    ) {}

    toPostgres(): QueryConfig<any[]> {
        let valueIndex = 1;
        const values: Value[] = [];
        function value(value: Value) {
            values.push(value);
            return `$${valueIndex++}`;
        }
        const { from, limit, where } = this.properties;
        const clauses = [`SELECT * FROM "${formatIdentifier(from.tableName)}"`];
        if (where != null) {
            clauses.push(where.toPostgres(value));
        }
        if (limit != null) {
            clauses.push(`LIMIT ${value(limit)}`);
        }
        return {
            text: clauses.join(" "),
            values: values,
        };
    }
}
