import Axios from "axios";
import { User } from "engine/models/User";
import { parse } from "engine/schema/Parse";

export class UserService {
    static current(): Promise<User | null> {
        return Axios.get("/api/user/me").then((t) => {
            if (t.data == null) {
                return null;
            } else {
                return parse(t.data, UserSchema);
            }
        });
    }
}
