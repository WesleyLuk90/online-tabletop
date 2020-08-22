import { iots, optional } from "../schemas/iots";
import { UserDataSchema } from "../schemas/UserData";
import { Api } from "./Api";

export const GetCurrentUser = new Api(
    "getCurrentUser",
    iots.void,
    optional(UserDataSchema)
);
