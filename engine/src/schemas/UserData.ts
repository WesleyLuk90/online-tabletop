import * as t from "io-ts";

export const UserDataSchema = t.strict({
    id: t.string,
    displayName: t.string,
});

export interface UserData extends t.TypeOf<typeof UserDataSchema> {}
