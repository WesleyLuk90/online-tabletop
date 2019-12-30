import Axios from "axios";
import { User } from "protocol/src/User";

export class UserService {
    static current(): Promise<User | null> {
        return Axios.get("/api/user/me").then(t => t.data);
    }
}
