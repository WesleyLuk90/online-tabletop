import * as iots from "io-ts";
export * as iots from "io-ts";

export function optional<A>(
    t: iots.Type<A>
): iots.UnionC<[iots.Type<A>, iots.NullC]> {
    return iots.union([t, iots.null]);
}
