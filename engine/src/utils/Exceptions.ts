import { Either, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

export function rightOrThrow<E, A>(either: Either<E, A>): A {
    return pipe(
        either,
        fold(
            (l) => {
                throw l;
            },
            (r) => r
        )
    );
}
