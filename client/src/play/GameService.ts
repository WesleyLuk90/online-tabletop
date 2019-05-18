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
            MessageValidator.decode(message).fold(
                err => {
                    console.error("Failed to decode message", err);
                },
                mes => this.onMessage(mes)
            );
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
