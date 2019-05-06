import { newId } from "./protocol/Id";
import { Message } from "./protocol/Messages";

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
