import { Field } from "./BaseSchema";
import { Row } from "./BaseStore";

export abstract class BaseModel {
    constructor(public row: Row) {}

    setter<T>(field: Field<T>): (value: T) => this {
        const self = this;
        return (value) => {
            this.row.values.set(field, value);
            return self;
        };
    }
}
