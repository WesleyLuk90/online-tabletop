import { DataSchema, parse } from "engine";

export class FieldType<T> {
    constructor(
        readonly postgresType: string,
        readonly toDB: (t: T) => any,
        readonly fromDB: (value: any) => T
    ) {}
}

export class JsonFieldType<T> extends FieldType<T> {
    constructor(schema: DataSchema<T>) {
        super(
            "jsonb",
            (t: any) => parse(t, schema),
            (val: string) => parse(val, schema)
        );
    }
}

export const StringField = new FieldType<string>(
    "TEXT",
    (t) => t,
    (t) => t
);
