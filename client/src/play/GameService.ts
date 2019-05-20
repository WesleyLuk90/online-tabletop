import { PathReporter } from "io-ts/lib/PathReporter";
import { Message, MessageValidator } from "protocol/lib/Messages";
import io from "socket.io-client";
import { TokenService } from "./TokenService";

export class GameService {
    socket = io({
        path: "/socket/play"
    });
    constructor(
        readonly gameId: string,
        readonly onMessage: (message: Message) => void,
        readonly onDisconnect: () => void
    ) {
        this.socket.on("disconnect", onDisconnect);
        this.socket.on("connect", () => this.sendHandshake());
        this.socket.on("game.message", (message: any) => {
            const maybeMessage = MessageValidator.decode(message);
            if (maybeMessage.isLeft()) {
                console.error(
                    "Failed to parse message",
                    PathReporter.report(maybeMessage)
                );
            }
            maybeMessage.map(mes => this.onMessage(mes));
        });
    }

    private async sendHandshake() {
        console.log("Connected, sending handshake");
        const token = await TokenService.get(this.gameId);
        this.socket.emit("game.handshake", token);
    }

    sendMessage(message: Message) {
        this.socket.emit("game.message", message);
    }
}
