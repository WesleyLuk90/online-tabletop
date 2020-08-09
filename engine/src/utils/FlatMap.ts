import { pipe } from "fp-ts/lib/function";
import { flatten, map, Option } from "fp-ts/lib/Option";

export function flatMap<T, K>(
    mapper: (t: T) => Option<K>
): (t: Option<T>) => Option<K> {
    return (t) => pipe(t, map(mapper), flatten);
}
