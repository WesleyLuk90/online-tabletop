import { Field } from "./BaseSchema";
import { Row } from "./BaseStore";

export abstract class BaseModel {
    static setter<T>(field: Field<T>) {
        return (prototype: any, name: string) => {
            prototype[name] = function (value: T) {
                (this as BaseModel).row.values.set(field, value);
                return this;
            };
        };
    }

    constructor(public row: Row) {}
}
