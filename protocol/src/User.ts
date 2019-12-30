import * as t from "io-ts";

export const UserSchema = t.strict({
    id: t.string,
    displayName: t.string
});

export type User = t.TypeOf<typeof UserSchema>;
