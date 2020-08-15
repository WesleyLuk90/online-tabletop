import { QueryConfig } from "pg";
import { BaseSchema } from "./BaseSchema";

export class Query {
    constructor(
        readonly properties: {
            from: BaseSchema;
        }
    ) {}

    toPostgres(): QueryConfig<any[]> {
        return {
            text: "SELECT * FROM $1",
            values: [this.properties.from.tableName],
        };
    }
}
