import { User } from "engine/engine/models/User";
import React, { useEffect, useState } from "react";
import { UserService } from "../services/UserService";

export function Auth({
    loggedIn,
    notLoggedIn,
}: {
    loggedIn: (user: User) => React.ReactElement | null;
    notLoggedIn?: () => React.ReactElement | null;
}): React.ReactElement | null {
    const [loginState, setLoginState] = useState<User | boolean>(true);
    useEffect(() => {
        UserService.current().then((user) => {
            if (user != null) {
                setLoginState(user);
            }
        });
    }, []);

    if (loginState === false) {
        return null;
    }
    if (loginState === true) {
        if (notLoggedIn != null) {
            return notLoggedIn();
        }
        return null;
    }
    return loggedIn(loginState);
}
