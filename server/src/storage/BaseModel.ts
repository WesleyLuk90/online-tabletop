import { Field } from "./BaseSchema";
import { Row } from "./BaseStore";

export abstract class BaseModel {
    static setter<T>(field: Field<T>) {
        return (prototype: object, name: string) => {
            console.log(prototype, name);
        };
    }
    constructor(public row: Row) {}
}
