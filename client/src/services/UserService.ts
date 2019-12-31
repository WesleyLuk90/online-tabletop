import Axios from "axios";
import { parse } from "protocol/src/Parse";
import { User, UserSchema } from "protocol/src/User";

export class UserService {
    static current(): Promise<User | null> {
        return Axios.get("/api/user/me").then(t => parse(t.data, UserSchema));
    }
}
