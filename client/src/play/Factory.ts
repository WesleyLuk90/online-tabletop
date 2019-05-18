import { newId } from "protocol/lib/Id";
import { Message } from "protocol/lib/Messages";

export class Factory {
    static createToken(sceneId: string): Message {
        return {
            id: newId(),
            type: "update-token",
            sceneId,
            token: {
                id: newId(),
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
        };
    }
}
