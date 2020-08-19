import * as t from "io-ts";
import { rightOrThrow } from "../utils/Exceptions";

export function parse<A>(data: any, schema: t.Type<A>): A {
    return rightOrThrow(schema.decode(data));
}
