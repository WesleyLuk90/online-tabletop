import { DataSchema } from "engine";
import { FieldType, JsonFieldType, StringField } from "./FieldType";

export const KnownSchemas: BaseSchema[] = [];

export class Field<T> {
    constructor(readonly name: string, readonly type: FieldType<T>) {}

    toString() {
        return `Field(${this.name})`;
    }
}

export abstract class BaseSchema {
    readonly fields: Field<any>[] = [];
    constructor(readonly tableName: string) {
        KnownSchemas.push(this);
    }

    primaryKey: Field<string> | null = null;

    addField<T>(field: Field<T>): Field<T> {
        this.fields.push(field);
        return field;
    }

    stringField(name: string): Field<string> {
        return this.addField(new Field(name, StringField));
    }

    jsonField<T>(name: string, type: DataSchema<T>): Field<T> {
        return this.addField(new Field(name, new JsonFieldType(type)));
    }

    validateField(field: Field<{}>) {
        if (!this.fields.includes(field)) {
            throw new Error(`Schema does not include field ${field}`);
        }
    }
}
