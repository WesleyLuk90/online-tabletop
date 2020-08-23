export * as E from "fp-ts/lib/Either";
export { pipe } from "fp-ts/lib/function";
export * as O from "fp-ts/lib/Option";
import { Either as EitherType } from "fp-ts/lib/Either";
import { Option as OptionType } from "fp-ts/lib/Option";

export type Either<E, A> = EitherType<E, A>;
export type Option<A> = OptionType<A>;
