import * as t from "io-ts";

export const UserSchema = t.strict({
    id: t.string,
    displayName: t.string
});

export interface User extends t.TypeOf<typeof UserSchema> {}
