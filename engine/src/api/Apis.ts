import { optional } from "../schemas/iots";
import { UserDataSchema } from "../schemas/UserData";
import { Api, ApiVoid } from "./Api";

export const GetCurrentUser = new Api(
    "getCurrentUser",
    ApiVoid,
    optional(UserDataSchema)
);
