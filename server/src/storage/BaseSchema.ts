export const KnownSchemas: BaseSchema[] = [];

class FieldType<T> {
    constructor(readonly postgresType: string) {}
}

export const StringField = new FieldType<string>("TEXT");

export class Field<T> {
    constructor(readonly name: string, readonly type: FieldType<T>) {}
}

export abstract class BaseSchema {
    readonly fields: Field<{}>[] = [];
    constructor(readonly tableName: string) {
        KnownSchemas.push(this);
    }

    primaryKey: Field<{}> | null = null;

    private addField<T>(field: Field<T>): Field<T> {
        this.fields.push(field);
        return field;
    }

    stringField(name: string): Field<string> {
        return this.addField(new Field(name, StringField));
    }

    validateField(field: Field<{}>) {
        if (!this.fields.includes(field)) {
            throw new Error(`Schema does not include field ${field}`);
        }
    }
}
