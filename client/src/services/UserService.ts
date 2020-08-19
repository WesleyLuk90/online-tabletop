import Axios from "axios";
import { User } from "engine/engine/models/User";
import { parse } from "engine/schemas/Parse";
import { UserDataSchema } from "engine/schemas/UserData";

export class UserService {
    static async current(): Promise<User | null> {
        const res = await Axios.get("/api/user/me");
        const userData = parse(res.data, UserDataSchema);

        return new User(userData.id, userData.displayName);
    }
}
