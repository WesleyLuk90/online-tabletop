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

    static getter<T>(field: Field<T>) {
        return (prototype: any, name: string) => {
            prototype[name] = function () {
                return (this as BaseModel).row.values.get(field);
            };
        };
    }

    constructor(public row: Row) {}
}
